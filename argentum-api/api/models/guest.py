import django_filters
from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, serializers, status, mixins
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import Status
from argentum.settings import CURRENCY_CONFIG


class Guest(models.Model):
    code = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=64, blank=True)
    mail = models.CharField(max_length=64, blank=True)
    status = models.ForeignKey('api.Status', related_name='guests', default=None, null=True, on_delete=models.SET_NULL)
    checked_in = models.DateTimeField(default=None, null=True)
    card = models.CharField(max_length=32, default=None, null=True, unique=True, blank=True)
    balance = models.DecimalField(default=0, **CURRENCY_CONFIG)
    bonus = models.DecimalField(default=0, **CURRENCY_CONFIG)

    def __str__(self):
        return f'Guest(id={self.id},name="{self.name}",code="{self.code}")'


class GuestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['id', 'code', 'name', 'mail', 'status', 'checked_in', 'card', 'balance', 'bonus']
        read_only_fields = ['balance', 'bonus']


class GuestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = GuestCreateSerializer.Meta.fields
        read_only_fields = ['balance', 'bonus']


class GuestListUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer to be used when importing a guest list. Event-specific data is explicitly declared readonly. Merges are
    to be performed based on code. Guests without matching codes will be newly created.
    """

    class Meta:
        model = Guest
        fields = GuestCreateSerializer.Meta.fields
        read_only_fields = ['checked_in', 'card', 'balance', 'bonus']

    def to_internal_value(self, data):
        # The original implementation gets rid of values that don't match a mutable field during validation.
        ret = super().to_internal_value(data)
        if self.partial:
            # Partial is only used for updates of existing entries.
            ret['instance'] = data['instance']
        return ret

    def create(self, validated_data):
        if self.partial:
            # Partial is only used for updates of existing entries.
            instance = validated_data.pop('instance')
            return self.update(instance, validated_data)
        else:
            return super().create(validated_data)


class GuestViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    class SearchFilter(django_filters.FilterSet):
        card = django_filters.CharFilter(field_name='card', lookup_expr='iexact')
        code = django_filters.CharFilter(field_name='code', lookup_expr='icontains')
        name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
        mail = django_filters.CharFilter(field_name='mail', lookup_expr='icontains')
        status = django_filters.ModelChoiceFilter(queryset=Status.objects.all(), field_name='status', null_label='null')

    queryset = Guest.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = SearchFilter
    ordering = ('id',)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return GuestUpdateSerializer
        elif self.action in ['list_update']:
            return GuestListUpdateSerializer
        else:
            return GuestCreateSerializer

    @action(detail=False, methods=['patch'])
    def list_update(self, request: Request):
        # Look up existing codes and store instance references in the update data. These references will be tunneled
        # through validation by the serializer, and finally be used when saving the serializer data.
        update_data = []
        create_data = []
        for raw_guest in request.data:
            guests = Guest.objects.filter(code=raw_guest['code'])
            if guests:
                update_data.append(raw_guest)
                del update_data[-1]['code']
                update_data[-1]['instance'] = guests[0]
            else:
                create_data.append(raw_guest)

        create_serializer = self.get_serializer(data=create_data, many=True)
        create_serializer.is_valid(raise_exception=True)
        update_serializer = self.get_serializer(data=update_data, many=True, partial=True)
        update_serializer.is_valid(raise_exception=True)
        self.perform_create(create_serializer)
        self.perform_update(update_serializer)

        if create_data:
            headers = self.get_success_headers(create_serializer.data)
            return Response(
                create_serializer.data + update_serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        else:
            return Response(update_serializer.data)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request: Request):
        Guest.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
