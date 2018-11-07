from typing import Any, Dict

from django.utils import timezone
from rest_framework import serializers

from api.models import Guest, Transaction


class GuestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['id', 'code', 'name', 'mail', 'status', 'checked_in', 'card', 'balance', 'bonus']


class GuestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = GuestCreateSerializer.Meta.fields
        read_only_fields = ['code', 'name', 'mail', 'status', 'card', 'balance', 'bonus']


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
