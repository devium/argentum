from typing import Any, Dict

from django.db import models, transaction
from django.utils import timezone
from rest_framework import mixins, viewsets, serializers
from rest_framework.filters import OrderingFilter

from api.models import Guest, Order, Tag
from api.models.commitable import Committable
from api.models.label import Label, LabelSerializer
from api.models.order import OrderUpdateSerializer
from api.models.utils import resolve_card, UpdateLockedModelMixin


class TagRegistration(Committable):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    # Many-to-one fields specified in the other models:
    # labels

    def __str__(self):
        return f'TagRegistration(' \
               f'id={self.id},' \
               f'time={self.time},' \
               f'labels={[label.value for label in self.labels.all()]},' \
               f'guest={self.guest},' \
               f'order={self.order},' \
               f'pending={self.pending}' \
               f')'


class TagRegistrationListSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True)

    class Meta:
        model = TagRegistration
        fields = ['id', 'time', 'labels', 'guest', 'order', 'pending']


class TagRegistrationCreateSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True)

    class Meta:
        model = TagRegistration
        fields = ['id', 'time', 'labels', 'guest', 'order', 'pending']
        read_only_fields = ['time', 'pending']
        extra_kwargs = {
            # Don't expose the guest ID in case the order is submitted via card (which should be the default).
            'guest': {'write_only': True}
        }

    def create(self, validated_data):
        with transaction.atomic():
            # Hide label creation from the default creator.
            labels = validated_data.pop('labels')
            instance = super().create(validated_data)
            # Validated label data already contains a properly specified label 'value' field due to the LabelSerializer.
            Label.objects.bulk_create(Label(tag_registration=instance, value=label['value']) for label in labels)
            return instance


class TagRegistrationUpdateSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True)

    class Meta:
        model = TagRegistration
        # Make no guest information available. Only admins may get that via orders.
        fields = ['id', 'time', 'labels', 'order', 'pending']

    def get_fields(self):
        committed = not self.instance.pending
        if committed:
            self.Meta.read_only_fields = ['time', 'labels', 'order', 'pending']
        else:
            self.Meta.read_only_fields = ['time', 'labels', 'order']
        return super().get_fields()

    def update(self, instance: TagRegistration, validated_data: Dict[str, Any]):
        committed = not instance.pending
        commit = not committed and not validated_data.get('pending', True)

        if commit:
            instance.time = timezone.now()
            # Commit order. If for some reason the order is already committed, this does nothing.
            order_serializer = OrderUpdateSerializer(
                instance.order,
                data={'pending': False},
                partial=True
            )
            order_serializer.is_valid(raise_exception=True)
            order_serializer.validated_data['time'] = instance.time

            # Create or update tags.
            labels = [label.value for label in instance.labels.all()]
            updates = Tag.objects.filter(label__in=labels)
            for tag in updates:
                tag.guest = instance.guest

            existing_labels = [tag.label for tag in updates]
            new_labels = list(set(labels) - set(existing_labels))

            with transaction.atomic():
                order_serializer.save()
                Tag.objects.bulk_update(updates, ['guest'])
                Tag.objects.bulk_create(Tag(guest=instance.guest, label=label) for label in new_labels)
                return super().update(instance, validated_data)

        return super().update(instance, validated_data)


class TagRegistrationViewSet(
    mixins.CreateModelMixin,
    UpdateLockedModelMixin,
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
