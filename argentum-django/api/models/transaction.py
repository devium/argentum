from typing import Iterable, Dict, Any

from django.db import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, serializers
from rest_framework.permissions import BasePermission

from api.models.guest import Guest
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class Transaction(models.Model):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    value = models.DecimalField(**CURRENCY_CONFIG)
    description = models.CharField(max_length=64)
    pending = models.BooleanField(default=True)

    def __str__(self):
        return f'Transaction(' \
               f'id={self.id}, time={self.time}, guest={self.guest},' \
               f' value={self.value}, description=\'{self.description}\'' \
               f')'


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']
        read_only_fields = ['time', 'pending']


class TransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = TransactionCreateSerializer.Meta.fields
        read_only_fields = ['time']

    def get_fields(self):
        if self.instance.pending:
            self.Meta.read_only_fields = ['time']
        else:
            self.Meta.read_only_fields = self.Meta.fields
        return super().get_fields()

    def update(self, instance: Transaction, validated_data: Dict[str, Any]):
        self.instance.time = timezone.now()
        super().update(instance, validated_data)

        if not instance.pending:
            # Transaction can only be committed once. This is where it is credited.
            if instance.value > 0:
                instance.guest.balance += instance.value
            else:
                # Subtract from bonus first.
                remaining_value = -instance.value
                if remaining_value > instance.guest.bonus:
                    remaining_value -= instance.guest.bonus
                    instance.guest.bonus = 0
                else:
                    instance.guest.bonus -= remaining_value
                    remaining_value = 0
                instance.guest.balance -= remaining_value

            instance.guest.save()

        return instance


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
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),
