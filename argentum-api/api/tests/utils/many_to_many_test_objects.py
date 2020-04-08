from typing import List, Type

from api.tests.utils.many_to_many_model import ManyToManyModel
from api.tests.utils.test_objects import TestObjects


class ManyToManyTestObjects(TestObjects):
    MODEL_EXT: Type[ManyToManyModel] = None
    SAVED_EXT: List[ManyToManyModel] = []
    UNSAVED_EXT: List[ManyToManyModel] = []

    @classmethod
    def create(cls):
        super().create()
        for obj in cls.SAVED_EXT:
            obj.set_many_to_many()
