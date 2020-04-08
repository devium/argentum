from django.db import models
from django.db.models import fields


class Committable(models.Model):
    pending = fields.BooleanField(default=True)

    class Meta:
        abstract = True
