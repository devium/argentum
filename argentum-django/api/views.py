from rest_framework import viewsets

from api.models import Guest, Transaction
from api.serializers import (
    GuestSerializer,
    TransactionCreateSerializer,
    TransactionUpdateSerializer
)


class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return TransactionUpdateSerializer
        else:
            return TransactionCreateSerializer
