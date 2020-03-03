from django.db import models
from rest_framework import serializers, mixins, viewsets
from rest_framework.filters import OrderingFilter

from api.models import Guest


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
    filter_backends = (OrderingFilter,)
    ordering = ('id',)
