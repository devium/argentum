import django_filters
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, serializers

from argentum.settings import CURRENCY_CONFIG


class Guest(models.Model):
    code = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=64)
    mail = models.CharField(max_length=64)
    status = models.CharField(max_length=32)
    checked_in = models.DateTimeField(default=None, null=True)
    card = models.CharField(default='', max_length=32, unique=True)
    balance = models.DecimalField(default=0, **CURRENCY_CONFIG)
    bonus = models.DecimalField(default=0, **CURRENCY_CONFIG)

    def __str__(self):
        return f'Guest(id={self.id}, name=\'{self.name}\', code=\'{self.code})\''


class GuestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['id', 'code', 'name', 'mail', 'status', 'checked_in', 'card', 'balance', 'bonus']


class GuestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = GuestCreateSerializer.Meta.fields
        read_only_fields = ['code', 'name', 'mail', 'status', 'card', 'balance', 'bonus']


class GuestViewSet(viewsets.ModelViewSet):
    class SearchFilter(django_filters.FilterSet):
        code = django_filters.CharFilter(field_name='code', lookup_expr='icontains')
        name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
        mail = django_filters.CharFilter(field_name='mail', lookup_expr='icontains')
        status = django_filters.CharFilter(field_name='status', lookup_expr='icontains')

    queryset = Guest.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_class = SearchFilter

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return GuestUpdateSerializer
        else:
            return GuestCreateSerializer
