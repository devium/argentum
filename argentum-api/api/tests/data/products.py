from decimal import Decimal

from api.models.product import Product
from api.tests.data.categories import TestCategories
from api.tests.utils.test_objects import TestObjects


class TestProducts(TestObjects):
    MODEL = Product

    COAT_CHECK_ITEM = MODEL(
        id=1,
        name='Coat check item',
        deprecated=False,
        price=Decimal('1.00'),
        category=TestCategories.COAT_CHECK
    )

    WATER = MODEL(
        id=2,
        name='Water',
        deprecated=False,
        price=Decimal('2.40'),
        category=TestCategories.SOFT_DRINKS
    )

    COKE = MODEL(
        id=3,
        name='Coke',
        deprecated=True,
        price=Decimal('3.20'),
        category=None
    )

    ALL = [COAT_CHECK_ITEM, WATER, COKE]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    BEER_MIN = MODEL(
        id=4,
        name='Beer',
        deprecated=False,
        price=Decimal('3.60'),
        category=None
    )

    BEER_MAX = MODEL(
        id=4,
        name='Beer',
        deprecated=True,
        price=Decimal('3.60'),
        category=TestCategories.HARD_DRINKS
    )

    WATER_PATCHED = MODEL(
        id=2,
        name='Aqua',
        deprecated=True,
        price=Decimal('2.40'),
        category=TestCategories.SOFT_DRINKS
    )
