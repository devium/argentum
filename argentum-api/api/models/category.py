from django.db import models
from rest_framework import serializers, viewsets, mixins
from rest_framework.filters import OrderingFilter


class Category(models.Model):
    name = models.CharField(max_length=64)
    color = models.CharField(max_length=8)

    def __str__(self):
        return f'Category(id={self.id},name="{self.name}",color="{self.color}")'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color']


class CategoryViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = (OrderingFilter,)
    ordering = ('id',)
