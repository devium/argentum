from django.db import models
from rest_framework import mixins, viewsets, serializers

from api.models.product import Product


class OrderItem(models.Model):
    order = models.ForeignKey('Order', related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_initial = models.IntegerField()
    quantity_current = models.IntegerField()

    def __str__(self):
        return f'OrderItem(' \
            f'id={self.id},' \
            f'product={self.product}' \
            f'quantity_initial={self.quantity_initial},' \
            f'quantity_current={self.quantity_current},' \
            f')'


class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity_initial', 'quantity_current']
        read_only_fields = ['quantity_current']


class OrderItemViewSet(
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    queryset = OrderItem.objects.all()
