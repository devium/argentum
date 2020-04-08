from django.contrib.auth.models import Group

from api.tests.data.product_ranges import TestProductRanges
from api.tests.utils.test_objects import TestObjects


class TestGroups(TestObjects):
    MODEL = Group

    # These models are created in the initial Django signal, not from this data. These are just for easy handling.
    ADMIN: MODEL
    ORDER: MODEL
    COAT_CHECK: MODEL
    CHECK_IN: MODEL
    TRANSFER: MODEL
    SCAN: MODEL
    PRODUCT_RANGE_ALL: MODEL
    PRODUCT_RANGE_1: MODEL
    PRODUCT_RANGE_2: MODEL

    @classmethod
    def init(cls):
        cls.ADMIN = cls.MODEL(id=14010, name='admin')
        cls.ORDER = cls.MODEL(id=14020, name='order')
        cls.COAT_CHECK = cls.MODEL(id=14030, name='coat_check')
        cls.CHECK_IN = cls.MODEL(id=14040, name='check_in')
        cls.TRANSFER = cls.MODEL(id=14050, name='transfer')
        cls.SCAN = cls.MODEL(id=14060, name='scan')
        cls.PRODUCT_RANGE_ALL = cls.MODEL(id=14070, name='product_range_all')
        cls.PRODUCT_RANGE_1 = cls.MODEL(id=14080, name=f'product_range_{TestProductRanges.JUST_WATER.id}')
        cls.PRODUCT_RANGE_2 = cls.MODEL(id=14090, name=f'product_range_{TestProductRanges.EVERYTHING.id}')

        cls.SAVED = [
            cls.ADMIN,
            cls.ORDER,
            cls.COAT_CHECK,
            cls.CHECK_IN,
            cls.TRANSFER,
            cls.SCAN,
            cls.PRODUCT_RANGE_ALL,
            cls.PRODUCT_RANGE_1,
            cls.PRODUCT_RANGE_2
        ]

    @classmethod
    def create(cls):
        # Establish links between these groups and the ones already in the DB.
        for group in cls.SAVED:
            group: Group = group
            group.id = Group.objects.get(name=group.name).id
            # Link to DB so many-to-many relations can be set.
            group.refresh_from_db()
