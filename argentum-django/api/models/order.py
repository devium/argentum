from typing import Dict, Any

from django.db import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets, serializers

from api.models.guest import Guest
from api.models.order_item import OrderItemCreateSerializer, OrderItem
from api.models.transaction import Transaction, TransactionUpdateSerializer
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

    def __str__(self):
        return f'Order(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'custom_initial={self.custom_initial},' \
            f'custom_current={self.custom_current},' \
            f'guest={self.guest},' \
            f'items=[{",".join(str(item) for item in self.items.all())}]' \
            f')'


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'time', 'guest', 'custom_initial', 'custom_current', 'items', 'pending']
        read_only_fields = ['time', 'custom_current', 'pending']

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
    class Meta:
        model = Order
        fields = OrderCreateSerializer.Meta.fields

    def get_fields(self):
        if self.instance.pending:
            self.Meta.read_only_fields = ['time', 'guest', 'custom_initial', 'custom_current']
        else:
            self.Meta.read_only_fields = ['time', 'guest', 'custom_initial', 'pending']
        return super().get_fields()

    def update(self, instance: Order, validated_data: Dict[str, Any]):
        self.instance.time = timezone.now()
        committed = not self.instance.pending
        commit = not committed and not validated_data.get('pending', True)
        super().update(instance, validated_data)

        if commit:
            # Order can only be committed once. This is where it is credited.
            total = self.instance.custom_current + sum(
                item.quantity_current * item.product.price
                for item in self.instance.items.all()
            )
            transaction = Transaction.objects.create(
                guest=self.instance.guest,
                value=-total,
                description='order',
                order=self.instance
            )
            transaction_serializer = TransactionUpdateSerializer(transaction, data={'pending': False}, partial=True)
            transaction_serializer.is_valid(raise_exception=True)
            transaction_serializer.validated_data['time'] = self.instance.time
            transaction_serializer.save()

        return instance


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('guest__card',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        else:
            return OrderCreateSerializer

    def get_permissions(self):
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),
