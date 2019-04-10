from django.contrib.auth.models import User
from rest_framework import serializers, viewsets


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
