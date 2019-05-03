from django.contrib.auth.models import Group
from rest_framework import serializers, viewsets, mixins
from rest_framework.filters import OrderingFilter


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']
        read_only_fields = fields


class GroupViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = (OrderingFilter,)
    ordering = ('id',)
