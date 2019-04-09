from django.db import models
from rest_framework import serializers, viewsets

from api.models.category import Category
from argentum.settings import CURRENCY_CONFIG


class Product(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(**CURRENCY_CONFIG)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'Product(' \
            f'id={self.id},' \
            f'name="{self.name}",' \
            f'price={self.price},' \
            f'category={self.category}' \
            f')'


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category']


class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ProductCreateSerializer.Meta.fields
        read_only_fields = ['price']


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        else:
            return ProductCreateSerializer
