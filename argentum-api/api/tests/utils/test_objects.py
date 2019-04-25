from typing import Type

from django.db import models


class TestObjects:
    INIT_DB = True
    MODEL: Type[models.Model] = None
    ALL = []

    @classmethod
    def init(cls):
        if cls.INIT_DB:
            cls.MODEL.objects.bulk_create(cls.ALL)
            for object_ in cls.ALL:
                object_.refresh_from_db()

    @classmethod
    def post_init(cls):
        pass
