
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import models
from rest_framework import serializers, viewsets, mixins
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import OR
from rest_framework.request import Request

from api.models.product import ProductChildSerializer
from argentum.permissions import StrictModelPermissions


class ProductRange(models.Model):
    name = models.CharField(max_length=64)
    permission_codename_prefix = f'view_productrange_'

    # Many-to-one fields specified in the other models:
    # products

    def __str__(self):
        return f'ProductRange(id={self.id},name="{self.name}",num_products={self.products.count()})'

    @classmethod
    def get_permission_codename(cls, id_):
        return f'{cls.permission_codename_prefix}{id_}'

    @property
    def permission_codename(self):
        return self.get_permission_codename(self.id)

    @property
    def group_name(self):
        return f'product_range_{self.id}'

    def create_permission(self):
        permission = Permission.objects.create(
            name=f'Can view product range {self.id}',
            content_type=ContentType.objects.get(model=self.__class__.__name__.lower()),
            codename=self.permission_codename
        )
        group = Group.objects.create(name=self.group_name)
        group.permissions.add(permission)


class ProductRangeMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRange
        fields = ['id', 'name']

    def create(self, validated_data):
        instance: ProductRange = super().create(validated_data)
        instance.create_permission()
        return instance


class ProductRangeRetrieveSerializer(serializers.ModelSerializer):
    products = ProductChildSerializer(many=True)

    class Meta:
        model = ProductRangeMetaSerializer.Meta.model
        fields = ProductRangeMetaSerializer.Meta.fields + ['products']


class ProductRangeViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = ProductRange.objects.all()
    serializer_class = ProductRangeMetaSerializer
    filter_backends = (OrderingFilter,)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductRangeRetrieveSerializer
        else:
            return ProductRangeMetaSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            return OR(
                StrictModelPermissions({'GET': [f'%(app_label)s.view_productrange_all']}),
                StrictModelPermissions({'GET': [
                    f'%(app_label)s.{ProductRange.get_permission_codename(self.kwargs["pk"])}'
                ]})
            ),
        return StrictModelPermissions(),

    def list(self, request: Request, *args, **kwargs):
        permissions = [
            permission.split('_')[-1] for permission in request.user.get_all_permissions()
            if permission.startswith(f'{ProductRange._meta.app_label}.{ProductRange.permission_codename_prefix}')
        ]
        queryset = self.queryset
        if 'all' not in permissions:
            self.queryset = self.queryset.filter(pk__in=[int(permission) for permission in permissions])
        response = super().list(request, *args, **kwargs)
        self.queryset = queryset
        return response

    def perform_destroy(self, instance: ProductRange):
        Group.objects.get(name=instance.group_name).delete()
        Permission.objects.get(codename=instance.permission_codename).delete()
        super().perform_destroy(instance)
