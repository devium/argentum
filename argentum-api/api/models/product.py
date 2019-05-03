from django.db import models
from rest_framework import serializers, viewsets, mixins
from rest_framework.filters import OrderingFilter

from api.models.category import Category
from argentum.settings import CURRENCY_CONFIG


class Product(models.Model):
    name = models.CharField(max_length=64)
    deprecated = models.BooleanField(default=False)
    price = models.DecimalField(**CURRENCY_CONFIG)
    category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    product_ranges = models.ManyToManyField('api.ProductRange', related_name='products', default=[], blank=True)

    def __str__(self):
        return f'Product(' \
            f'id={self.id},' \
            f'name="{self.name}",' \
            f'deprecated={self.deprecated},' \
            f'price={self.price},' \
            f'category={self.category},' \
            f'product_ranges=[{",".join(str(product_range) for product_range in self.product_ranges.all())}]' \
            f')'


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'deprecated', 'price', 'category', 'product_ranges']


class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ProductCreateSerializer.Meta.fields
        read_only_fields = ['price']


class ProductChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'deprecated', 'price', 'category']


class ProductViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Product.objects.all()
    filter_backends = (OrderingFilter,)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        else:
            return ProductCreateSerializer
