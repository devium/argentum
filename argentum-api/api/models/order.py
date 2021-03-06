from decimal import Decimal
from typing import Dict, Any

from django.db import models, transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets, serializers
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter

from api.models.commitable import Committable
from api.models.config import Config
from api.models.discount import Discount
from api.models.guest import Guest
from api.models.order_item import OrderItemCreateSerializer, OrderItem, OrderItemListByCardSerializer
from api.models.transaction import TransactionUpdateSerializer
from api.models.utils import resolve_card, ListByCardModelMixin, UpdateLockedModelMixin
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class Order(Committable):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    custom_initial = models.DecimalField(**CURRENCY_CONFIG)
    custom_current = models.DecimalField(**CURRENCY_CONFIG)

    # Many-to-one fields specified in the other models:
    # transactions
    # items

    @property
    def total(self):
        return self.custom_current + sum(item.total for item in self.items.all())

    def __str__(self):
        return f'Order(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'custom_initial={self.custom_initial},' \
            f'custom_current={self.custom_current},' \
            f'guest={self.guest},' \
            f'items=[{",".join(str(item) for item in self.items.all())}],' \
            f'pending={self.pending}' \
            f')'


class OrderListSerializer(serializers.ModelSerializer):
    # Admin can resolve product references themselves because they have access to a complete product list.
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'time', 'guest', 'custom_initial', 'custom_current', 'items', 'pending']


class OrderListByCardSerializer(serializers.ModelSerializer):
    # When requesting the order history by card, products may include ranges that aren't accessible, so fully serialize
    # them. Exclude any guest information.
    items = OrderItemListByCardSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'time', 'custom_initial', 'custom_current', 'items', 'pending']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'time', 'guest', 'custom_initial', 'custom_current', 'items', 'pending']
        read_only_fields = ['time', 'custom_current', 'pending']
        extra_kwargs = {
            # Don't expose the guest ID in case the order is submitted via card (which should be the default).
            'guest': {'write_only': True}
        }

    def create(self, validated_data):
        validated_data['custom_current'] = validated_data['custom_initial']
        items_data = validated_data.pop('items')
        instance = self.Meta.model.objects.create(**validated_data)

        for item_data in items_data:
            item_data['discount'] = 0

        if validated_data['guest'].status:
            discounts = {
                discount.category: discount.rate
                for discount in Discount.objects.filter(status=validated_data['guest'].status)
            }
            for item_data in items_data:
                item_data['discount'] += discounts.get(item_data['product'].category, 0)

            for item_data in items_data:
                item_data['discount'] = max(0, min(1, item_data['discount']))

        OrderItem.objects.bulk_create(
            OrderItem(order=instance, quantity_current=item_data['quantity_initial'], **item_data)
            for item_data in items_data
        )
        return instance


class OrderUpdateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        # Make no guest information available. Only admins may get that via orders.
        fields = ['id', 'time', 'custom_initial', 'custom_current', 'items', 'pending']

    def get_fields(self):
        committed = not self.instance.pending
        if committed:
            self.Meta.read_only_fields = ['time', 'custom_initial', 'pending']
        else:
            self.Meta.read_only_fields = ['time', 'custom_initial', 'custom_current']
        return super().get_fields()

    def validate(self, attrs):
        committed = not self.instance.pending
        commit = not committed and not attrs.get('pending', True)

        if commit:
            postpaid_limit = Decimal(Config.objects.get(key='postpaid_limit').value)
            if self.instance.total > self.instance.guest.balance + self.instance.guest.bonus - postpaid_limit:
                raise ValidationError({'non_field_errors': 'Insufficient funds.'})

        if committed:
            custom_current = attrs.get('custom_current', None)
            # Cancellations may only decrease the current custom value.
            if custom_current is not None and (custom_current < 0 or custom_current >= self.instance.custom_current):
                raise ValidationError(
                    {'custom_current': 'Value needs to be a non-negative value lower than the current one.'}
                )

        return super().validate(attrs)

    def update(self, instance: Order, validated_data: Dict[str, Any]):
        committed = not self.instance.pending
        commit = not committed and not validated_data.get('pending', True)

        if commit:
            # Time is read-only but may be set via code, e.g., by a TagRegistration object.
            self.instance.time = validated_data.get('time', timezone.now())
            # Order can only be committed once. This is where it is credited.
            with transaction.atomic():
                TransactionUpdateSerializer.create_internal(
                    guest=self.instance.guest,
                    value=-self.instance.total,
                    description='order',
                    order=self.instance,
                    time=self.instance.time
                )
                return super().update(instance, validated_data)
        elif committed:
            custom_current = validated_data.get('custom_current', None)
            # Validation has already been performed. Just execute the transaction.
            with transaction.atomic():
                if custom_current is not None:
                    TransactionUpdateSerializer.create_internal(
                        guest=self.instance.guest,
                        value=self.instance.custom_current - custom_current,
                        description='cancel',
                        order=self.instance
                    )
                return super().update(instance, validated_data)
        else:
            return super().update(instance, validated_data)


class OrderViewSet(
    mixins.CreateModelMixin,
    UpdateLockedModelMixin,
    ListByCardModelMixin,
    viewsets.GenericViewSet
):
    queryset = Order.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields = ('guest__card',)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action == 'list':
            if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
                # Admin or order request.
                return OrderListByCardSerializer
            else:
                # Admin request.
                return OrderListSerializer
        elif self.action in ['update', 'partial_update']:
            # Commit or cancel request.
            return OrderUpdateSerializer
        else:
            # Create request.
            return OrderCreateSerializer

    def get_permissions(self):
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),

    def create(self, request, *args, **kwargs):
        resolve_card(request.data)
        return super().create(request, *args, **kwargs)
