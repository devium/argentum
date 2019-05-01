from typing import Dict, Any, Iterable

from django.db import models
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, viewsets, mixins
from rest_framework.permissions import BasePermission

from api.models.guest import Guest
from api.models.utils import resolve_card, ListByCardModelMixin
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class BonusTransaction(models.Model):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    value = models.DecimalField(**CURRENCY_CONFIG)
    description = models.CharField(max_length=64, default='default')
    pending = models.BooleanField(default=True)

    def __str__(self):
        return f'BonusTransaction(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'value={self.value},' \
            f'description="{self.description}",' \
            f'guest={self.guest}' \
            f')'


class BonusTransactionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']


class BonusTransactionListByCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = ['id', 'time', 'value', 'description', 'pending']


class BonusTransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']
        read_only_fields = ['time', 'description', 'pending']
        extra_kwargs = {
            # Don't expose the guest ID in case the transaction is submitted via card (which should be the default).
            'guest': {'write_only': True}
        }


class BonusTransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusTransaction
        fields = ['id', 'time', 'value', 'description', 'pending']

    def get_fields(self):
        if self.instance.pending:
            self.Meta.read_only_fields = ['time', 'guest', 'value', 'ignore_bonus', 'description']
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


class BonusTransactionViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    ListByCardModelMixin,
    viewsets.GenericViewSet
):
    queryset = BonusTransaction.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('guest__card',)

    def get_serializer_class(self):
        if self.action == 'list':
            if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
                # Admin or transfer request.
                return BonusTransactionListByCardSerializer
            else:
                # Admin request.
                return BonusTransactionListSerializer
        if self.action in ['update', 'partial_update']:
            return BonusTransactionUpdateSerializer
        else:
            return BonusTransactionCreateSerializer

    def get_permissions(self) -> Iterable[BasePermission]:
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),

    def create(self, request, *args, **kwargs):
        resolve_card(request.data)
        return super().create(request, *args, **kwargs)
