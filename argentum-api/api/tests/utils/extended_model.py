from typing import Type, Any, List

from django.db import models


class ExtendedModel:
    model: Type[models.Model] = None

    def __init__(self, *args, **kwargs):
        self.obj = self.model(*args, **kwargs)
