from decimal import Decimal

from api.models.product import Product
from api.tests.data.categories import TestCategories
from api.tests.utils.test_objects import TestObjects


class TestProducts(TestObjects):
    MODEL = Product

    COAT_CHECK_ITEM: MODEL
    WATER: MODEL
    COKE: MODEL

    BEER_MIN: MODEL
    BEER_MAX: MODEL
    WATER_PATCHED: MODEL
    WATER_DEPRECATED: MODEL

    @classmethod
    def init(cls):
        cls.COAT_CHECK_ITEM = cls.MODEL(
            id=12010,
            name='Coat check item',
            deprecated=False,
            price=Decimal('1.00'),
            category=TestCategories.COAT_CHECK
        )

        cls.WATER = cls.MODEL(
            id=12020,
            name='Water',
            deprecated=False,
            price=Decimal('2.40'),
            category=TestCategories.SOFT_DRINKS
        )

        cls.COKE = cls.MODEL(
            id=12030,
            name='Coke',
            deprecated=True,
            price=Decimal('3.20'),
            category=None
        )

        cls.SAVED = [cls.COAT_CHECK_ITEM, cls.WATER, cls.COKE]

        cls.BEER_MIN = cls.MODEL(
            id=12040,
            name='Beer',
            deprecated=False,
            price=Decimal('3.60'),
            category=None
        )

        cls.BEER_MAX = cls.MODEL(
            id=12041,
            name='Beer',
            deprecated=True,
            price=Decimal('3.60'),
            category=TestCategories.HARD_DRINKS
        )

        cls.WATER_PATCHED = cls.MODEL(
            id=12021,
            name='Aqua',
            deprecated=True,
            price=Decimal('2.40'),
            category=TestCategories.SOFT_DRINKS
        )

        cls.WATER_DEPRECATED = cls.MODEL(
            id=12022,
            name='Water',
            deprecated=True,
            price=Decimal('2.40'),
            category=TestCategories.SOFT_DRINKS
        )

        cls.UNSAVED = [cls.BEER_MIN, cls.BEER_MAX, cls.WATER_PATCHED, cls.WATER_DEPRECATED]



