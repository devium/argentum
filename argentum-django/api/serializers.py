from typing import Any, Dict

from django.utils import timezone
from rest_framework import serializers

from api.models import Guest, Transaction


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['id', 'code', 'name', 'mail', 'status', 'checked_in', 'card', 'balance', 'bonus']


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']
        read_only_fields = ['time', 'pending']


class TransactionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'time', 'guest', 'value', 'description', 'pending']
        read_only_fields = ['time']

    def validate(self, attrs: Dict[str, Any]):
        if not self.instance.pending:
            raise serializers.ValidationError('Transaction has already been committed.')
        return attrs

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
