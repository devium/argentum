from django.db import models
from rest_framework import serializers


class Label(models.Model):
    # Labels are used to indicate registration of one tag to a specific guest while Tags are used to keep track of
    # all registered labels/tags without the need to go through the registration history.
    # Labels are immutable but may be traced back to multiple guests via their respective registrations.
    # Tags are mutable but are 1:1-related to guests.
    value = models.IntegerField()
    tag_registration = models.ForeignKey(
        'api.TagRegistration',
        related_name='labels',
        on_delete=models.CASCADE
    )

    def str(self):
        return f'Label(value={self.value})'


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['value']

    def to_representation(self, instance):
        return instance.value

    def to_internal_value(self, data):
        # TagRegistration serializer receives a list of label values without proper field specification.
        return super().to_internal_value({'value': data})
