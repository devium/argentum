from django.db import models
from rest_framework import serializers, viewsets

from api.models.product import Product


class ProductRange(models.Model):
    name = models.CharField(max_length=64)
    products = models.ManyToManyField(Product)

    def __str__(self):
        return f'ProductRange(id={self.id},name="{self.name}",num_products={self.products.count()})'


class ProductRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRange
        fields = ['id', 'name', 'products']


class ProductRangeViewSet(viewsets.ModelViewSet):
    queryset = ProductRange.objects.all()
    serializer_class = ProductRangeSerializer
