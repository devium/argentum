from typing import Dict, Any

from django.db import models, transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, serializers, mixins
from rest_framework.filters import OrderingFilter

from api.models.commitable import Committable
from api.models.guest import Guest
from api.models.utils import resolve_card, ListByCardModelMixin, UpdateLockedModelMixin
from argentum.permissions import StrictModelPermissions
from argentum.settings import CURRENCY_CONFIG


class Transaction(Committable):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    value = models.DecimalField(**CURRENCY_CONFIG)
    ignore_bonus = models.BooleanField(default=False)
    description = models.CharField(max_length=64, default='default')
    order = models.ForeignKey(
        'api.Order',
        related_name='transactions',
        null=True,
        default=None,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return f'Transaction(' \
            f'id={self.id},' \
            f'time="{self.time}",' \
            f'value={self.value},' \
            f'description="{self.description}",' \
            f'order={self.order},' \
            f'guest={self.guest}' \
            f')'


class TransactionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'guest', 'value', 'ignore_bonus', 'description', 'order', 'pending']


class TransactionListByCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'value', 'ignore_bonus', 'description', 'order', 'pending']


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'guest', 'value', 'ignore_bonus', 'description', 'order', 'pending']
        read_only_fields = ['time', 'description', 'order', 'pending']
        extra_kwargs = {
            # Don't expose the guest ID in case the transaction is submitted via card (which should be the default).
            'guest': {'write_only': True}
        }


class TransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'value', 'ignore_bonus', 'description', 'order', 'pending']

    @classmethod
    def create_internal(cls, time=None, **transaction_kwargs):
        transaction = Transaction.objects.create(**transaction_kwargs)
        transaction_serializer = cls(transaction, data={'pending': False}, partial=True)
        # Should always be valid. Leaving this in for tests to catch.
        transaction_serializer.is_valid(raise_exception=True)
        if time is not None:
            transaction_serializer.validated_data['time'] = time
        return transaction_serializer.save()

    def get_fields(self):
        if self.instance.pending:
            self.Meta.read_only_fields = ['time', 'guest', 'value', 'ignore_bonus', 'order', 'description']
        else:
            self.Meta.read_only_fields = self.Meta.fields
        return super().get_fields()

    def update(self, instance: Transaction, validated_data: Dict[str, Any]):
        # Time may not be set externally but internal calls to the serializer may set the time manually, e.g. calls by
        # the order serializer to end up with the same timestamps on both the order and the transaction.
        self.instance.time = validated_data.pop('time', timezone.now())
        committed = not self.instance.pending
        commit = not committed and not validated_data.get('pending', True)

        if commit:
            # Transaction can only be committed once. This is where it is credited.
            if instance.ignore_bonus or instance.value > 0:
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

            with transaction.atomic():
                instance.guest.save()
                return super().update(instance, validated_data)

        # No reason to do this but go ahead.
        return super().update(instance, validated_data)


class TransactionViewSet(
    mixins.CreateModelMixin,
    UpdateLockedModelMixin,
    ListByCardModelMixin,
    viewsets.GenericViewSet
):
    queryset = Transaction.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields = ('guest__card',)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action == 'list':
            if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
                # Admin or transfer request.
                return TransactionListByCardSerializer
            else:
                # Admin request.
                return TransactionListSerializer
        elif self.action in ['update', 'partial_update']:
            return TransactionUpdateSerializer
        else:
            return TransactionCreateSerializer

    def get_permissions(self):
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),

    def create(self, request, *args, **kwargs):
        resolve_card(request.data)
        return super().create(request, *args, **kwargs)
