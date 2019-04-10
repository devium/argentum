from typing import Dict, Any, Iterable

from django.db import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets
from rest_framework.permissions import BasePermission

from api.models.guest import Guest
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class BonusTransaction(models.Model):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    value = models.DecimalField(**CURRENCY_CONFIG)
    description = models.CharField(max_length=64)
    pending = models.BooleanField(default=True)

    def __str__(self):
        return f'BonusTransaction(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'value={self.value},' \
            f'description="{self.description}",' \
            f'guest={self.guest}' \
            f')'


class BonusTransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']
        read_only_fields = ['time', 'pending']


class BonusTransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = BonusTransactionCreateSerializer.Meta.fields
        read_only_fields = ['time']

    def get_fields(self):
        if self.instance.pending:
            self.Meta.read_only_fields = ['time']
        else:
            self.Meta.read_only_fields = self.Meta.fields
        return super().get_fields()

    def update(self, instance: BonusTransaction, validated_data: Dict[str, Any]):
        self.instance.time = timezone.now()
        super().update(instance, validated_data)

        if not instance.pending:
            # Transaction can only be committed once. This is where it is credited.
            instance.guest.bonus += instance.value
            instance.guest.save()

        return instance


class BonusTransactionViewSet(viewsets.ModelViewSet):
    queryset = BonusTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('guest__card',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return BonusTransactionUpdateSerializer
        else:
            return BonusTransactionCreateSerializer

    def get_permissions(self) -> Iterable[BasePermission]:
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),
