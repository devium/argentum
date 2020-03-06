from typing import Any, Dict

from django.db import models
from django.utils import timezone
from rest_framework import mixins, viewsets, serializers
from rest_framework.filters import OrderingFilter

from api.models import Guest, Order, Tag
from api.models.order import OrderUpdateSerializer
from api.models.utils import resolve_card


class TagRegistration(models.Model):
    time = models.DateTimeField(default=timezone.now)
    label = models.IntegerField()
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    pending = models.BooleanField(default=True)

    def __str__(self):
        return f'TagRegistration(' \
               f'id={self.id},' \
               f'time={self.time},' \
               f'label={self.label},' \
               f'guest={self.guest},' \
               f'order={self.order},' \
               f'pending={self.pending}' \
               f')'


class TagRegistrationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagRegistration
        fields = ['id', 'time', 'label', 'guest', 'order', 'pending']


class TagRegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagRegistration
        fields = ['id', 'time', 'label', 'guest', 'order', 'pending']
        read_only_fields = ['time', 'pending']
        extra_kwargs = {
            # Don't expose the guest ID in case the order is submitted via card (which should be the default).
            'guest': {'write_only': True}
        }


class TagRegistrationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagRegistration
        # Make no guest information available. Only admins may get that via orders.
        fields = ['id', 'time', 'label', 'order', 'pending']

    def get_fields(self):
        committed = not self.instance.pending
        if committed:
            self.Meta.read_only_fields = ['time', 'label', 'order', 'pending']
        else:
            self.Meta.read_only_fields = ['time', 'label', 'order']
        return super().get_fields()

    def update(self, instance: TagRegistration, validated_data: Dict[str, Any]):
        committed = not self.instance.pending
        commit = not committed and not validated_data.get('pending', True)

        if commit:
            self.instance.time = timezone.now()
            # Commit order. If for some reason the order is already committed, this does nothing.
            order_serializer = OrderUpdateSerializer(
                self.instance.order,
                data={'pending': False, 'time': self.instance.time},
                partial=True
            )
            order_serializer.is_valid(raise_exception=True)
            order_serializer.save()

            # Create or update tag.
            tag = Tag.objects.update_or_create(label=self.instance.label, defaults={'guest': self.instance.guest})

        return super().update(instance, validated_data)


class TagRegistrationViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = TagRegistration.objects.all()
    filter_backends = (OrderingFilter,)
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action == 'list':
            # Admin list request.
            return TagRegistrationListSerializer
        elif self.action in ['update', 'partial_update']:
            # Commit request.
            return TagRegistrationUpdateSerializer
        else:
            # Create request.
            return TagRegistrationCreateSerializer

    def create(self, request, *args, **kwargs):
        resolve_card(request.data)
        return super().create(request, *args, **kwargs)
