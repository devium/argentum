from typing import Iterable

import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, serializers
from rest_framework.permissions import BasePermission

from api.models import Guest, Transaction
from api.serializers import (
    GuestCreateSerializer,
    TransactionCreateSerializer,
    TransactionUpdateSerializer,
    GuestUpdateSerializer
)
from argentum.permissions import StrictModelPermissions


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


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('guest__card',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return TransactionUpdateSerializer
        else:
            return TransactionCreateSerializer

    def get_permissions(self) -> Iterable[BasePermission]:
        if 'guest__card' in self.request.query_params:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),
