from django.core import validators
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets, mixins
from rest_framework.filters import OrderingFilter

from argentum.settings import DISCOUNT_CONFIG


class Discount(models.Model):
    status = models.ForeignKey('api.Status', related_name='discounts', on_delete=models.CASCADE)
    category = models.ForeignKey('api.Category', on_delete=models.CASCADE)
    rate = models.DecimalField(
        **DISCOUNT_CONFIG,
        validators=[validators.MinValueValidator(0.00), validators.MaxValueValidator(1.00)]
    )

    def __str__(self):
        return f'Discount(id={self.id},status={self.status},category={self.category},rate={self.rate})'


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'status', 'category', 'rate']


class DiscountViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields = ('status__guests__card',)
    ordering = ('id',)
