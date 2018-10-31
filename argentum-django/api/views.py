import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from api.models import Guest, Transaction
from api.serializers import (
    GuestSerializer,
    TransactionCreateSerializer,
    TransactionUpdateSerializer
)


class GuestViewSet(viewsets.ModelViewSet):
    class SearchFilter(django_filters.FilterSet):
        code = django_filters.CharFilter(field_name='code', lookup_expr='icontains')
        name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
        mail = django_filters.CharFilter(field_name='mail', lookup_expr='icontains')
        status = django_filters.CharFilter(field_name='status', lookup_expr='icontains')

    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = SearchFilter


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return TransactionUpdateSerializer
        else:
            return TransactionCreateSerializer
