from django.db import models
from rest_framework import serializers, viewsets, mixins


class Status(models.Model):
    internal_name = models.CharField(max_length=64, unique=True)
    display_name = models.CharField(max_length=64)
    color = models.CharField(max_length=8)

    def __str__(self):
        return f'Status(' \
            f'id={self.id},' \
            f'internal_name="{self.internal_name}",' \
            f'display_name="{self.display_name}",' \
            f'color="{self.color}"' \
            f')'


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = ['id', 'internal_name', 'display_name', 'color']


class StatusViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
