from django.db import models
from rest_framework import serializers, viewsets, mixins


class Config(models.Model):
    key = models.CharField(max_length=32, unique=True)
    value = models.CharField(max_length=32)

    def __str__(self):
        return f'Config(id={self.id},key="{self.key}",value="{self.value}")'


class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ['id', 'key', 'value']
        read_only_fields = ['key']


class ConfigViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
