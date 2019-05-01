from decimal import Decimal
from typing import Dict, Any

from django.db import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets, serializers, status
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request
from rest_framework.response import Response

from api.models.config import Config
from api.models.guest import Guest
from api.models.order_item import OrderItemCreateSerializer, OrderItem, OrderItemListByCardSerializer
from api.models.transaction import TransactionUpdateSerializer
from api.models.utils import resolve_card, ListByCardModelMixin
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class Order(models.Model):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    custom_initial = models.DecimalField(**CURRENCY_CONFIG)
    custom_current = models.DecimalField(**CURRENCY_CONFIG)
    pending = models.BooleanField(default=True)

    # Many-to-one fields specified in the other models:
    # transactions
    # items

    @property
    def total(self):
        return self.custom_current + sum(
            item.quantity_current * item.product.price
            for item in self.items.all()
        )

    def __str__(self):
        return f'Order(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'custom_initial={self.custom_initial},' \
            f'custom_current={self.custom_current},' \
            f'guest={self.guest},' \
            f'items=[{",".join(str(item) for item in self.items.all())}]' \
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
            self.instance.time = timezone.now()
            # Order can only be committed once. This is where it is credited.
            TransactionUpdateSerializer.create_internal(
                guest=self.instance.guest,
                value=-self.instance.total,
                description='order',
                order=self.instance,
                time=self.instance.time
            )

        if committed:
            custom_current = validated_data.get('custom_current', None)
            # Validation has already been performed. Just execute the transaction.
            if custom_current is not None:
                TransactionUpdateSerializer.create_internal(
                    guest=self.instance.guest,
                    value=self.instance.custom_current - custom_current,
                    description='cancel',
                    order=self.instance
                )

        return super().update(instance, validated_data)


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    ListByCardModelMixin,
    viewsets.GenericViewSet
):
    queryset = Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('guest__card',)

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
