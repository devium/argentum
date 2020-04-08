from typing import List, Dict

from django.db import models

from api.tests.utils.extended_model import ExtendedModel


class ManyToManyModel(ExtendedModel):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.many_to_many: Dict[str, List[models.Model]] = {}

    def set_many_to_many(self):
        for field_name, objects in self.many_to_many.items():
            getattr(self.obj, field_name).set(objects)
