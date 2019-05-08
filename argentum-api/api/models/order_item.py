from typing import Dict, Any

from django.db import models
from rest_framework import mixins, viewsets, serializers
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter

from api.models.product import Product, ProductCreateSerializer
from api.models.transaction import TransactionUpdateSerializer
from argentum.settings import DISCOUNT_CONFIG


class OrderItem(models.Model):
    order = models.ForeignKey('api.Order', related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_initial = models.IntegerField()
    quantity_current = models.IntegerField()
    discount = models.DecimalField(**DISCOUNT_CONFIG)

    def __str__(self):
        return f'OrderItem(' \
            f'id={self.id},' \
            f'product={self.product}' \
            f'quantity_initial={self.quantity_initial},' \
            f'quantity_current={self.quantity_current},' \
            f'discount={self.discount}' \
            f')'


class OrderItemListByCardSerializer(serializers.ModelSerializer):
    # Include a full serialization of the product since it may not be available to the user otherwise.
    product = ProductCreateSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity_initial', 'quantity_current', 'discount']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity_initial', 'quantity_current', 'discount']
        read_only_fields = ['quantity_current', 'discount']


class OrderItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = OrderItemCreateSerializer.Meta.fields

    def get_fields(self):
        committed = not self.instance.order.pending
        if committed:
            self.Meta.read_only_fields = ['product', 'quantity_initial', 'discount']
        else:
            self.Meta.read_only_fields = self.Meta.fields
        return super().get_fields()

    def validate(self, attrs):
        committed = not self.instance.order.pending

        if committed:
            quantity_current = attrs.get('quantity_current', None)
            if quantity_current is not None and (
                    quantity_current < 0 or quantity_current >= self.instance.quantity_current
            ):
                raise ValidationError(
                    {'quantity_current': 'Value needs to be a non-negative value lower than the current one.'}
                )

        return super().validate(attrs)

    def update(self, instance: OrderItem, validated_data: Dict[str, Any]):
        committed = not self.instance.order.pending

        if committed:
            quantity_current = validated_data.get('quantity_current', None)
            # Validation has already been performed. Just execute the transaction.
            if quantity_current is not None and self.instance.discount < 1:
                TransactionUpdateSerializer.create_internal(
                    guest=self.instance.order.guest,
                    value=(
                        (1 - self.instance.discount) *
                        (self.instance.quantity_current - quantity_current) *
                        self.instance.product.price
                    ),
                    description='cancel',
                    order=self.instance.order
                )

        return super().update(instance, validated_data)


class OrderItemViewSet(
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = OrderItem.objects.all()
    filter_backends = (OrderingFilter,)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return OrderItemUpdateSerializer
        else:
            return OrderItemCreateSerializer
