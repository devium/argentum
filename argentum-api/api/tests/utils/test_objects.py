from typing import Type, List

from django.db import models
from django.db.models import ForeignKey


class TestObjects:
    MODEL: Type[models.Model] = None
    SAVED: List[models.Model] = []
    UNSAVED: List[models.Model] = []

    @classmethod
    def init(cls):
        # Initialize model objects here before they are actually committed to the DB.
        pass

    @classmethod
    def create(cls):
        # Update related references. References to the objects themselves are stored but their IDs are outdated.
        # This requires that related objects already have their DB-issued ID, so make sure they are created first.
        foreign_fields = [
            field
            for field in cls.MODEL._meta.fields
            # Update owning relations only.
            if isinstance(field, ForeignKey)
        ]
        # Update foreign key fields if the related model has a valid DB ID.
        for obj in cls.SAVED + cls.UNSAVED:
            for field in foreign_fields:
                related_model = getattr(obj, field.name)
                if related_model is not None and related_model.id is not None:
                    setattr(obj, field.attname, related_model.id)

        db_objs = cls.MODEL.objects.bulk_create(cls.SAVED)

        # Store DB-allocated IDs in test objects.
        db_ids = [obj.id for obj in db_objs]
        for obj in cls.SAVED:
            obj.id = db_ids.pop(0)
            # Refreshing is not necessary as long as tests avoid manipulating the reference objects directly and
            # compensate for dynamically allocated fields, like IDs and timestamps.
