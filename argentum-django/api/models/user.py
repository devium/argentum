from typing import Iterable

from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response

from argentum.permissions import StrictModelPermissions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'groups']

    def to_internal_value(self, data):
        # The original implementation gets rid of values that don't match a mutable field during validation.
        ret = super().to_internal_value(data)
        if 'password' in data:
            ret['password'] = data['password']
        return ret

    def create(self, validated_data):
        new_user = User.objects.create_user(validated_data['username'], '', validated_data['password'])
        new_user.groups.add(*validated_data['groups'])
        return new_user

    def update(self, instance: User, validated_data):
        if 'username' in validated_data:
            instance.username = validated_data['username']
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        if 'groups' in validated_data:
            instance.groups.clear()
            instance.groups.add(*validated_data['groups'])
        instance.save()
        return instance


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self) -> Iterable[BasePermission]:
        if self.action == 'me':
            return StrictModelPermissions({'GET': ['%(app_label)s.view_me']}),
        else:
            return StrictModelPermissions(),

    @action(detail=False, methods=['get'])
    def me(self, request: Request):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
