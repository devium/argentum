from django.db import models
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, mixins, viewsets
from rest_framework.filters import OrderingFilter

from api.models import Guest
from argentum.permissions import StrictModelPermissions


class Tag(models.Model):
    label = models.IntegerField(unique=True)
    guest = models.ForeignKey(Guest, related_name='tags', on_delete=models.CASCADE)

    def __str__(self):
        return f'Tag(id={self.id},label={self.label},guest={self.guest})'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'label']


class TagViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter,)
    filter_fields = ('guest__card',)
    ordering = ('id',)

    def get_permissions(self):
        if 'guest__card' in self.request.query_params and self.request.query_params['guest__card']:
            return StrictModelPermissions({'GET': ['%(app_label)s.view_card_%(model_name)s']}),
        else:
            return StrictModelPermissions(),
