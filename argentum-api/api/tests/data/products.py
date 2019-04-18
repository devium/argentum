from decimal import Decimal

from api.models.product import Product
from api.tests.data.categories import TestCategories
from api.tests.utils.test_objects import TestObjects


class TestProducts(TestObjects):
    MODEL = Product

    WATER = MODEL(
        id=1,
        name="Water",
        deprecated=False,
        price=Decimal("2.40"),
        category=TestCategories.SOFT_DRINKS
    )

    COKE = MODEL(
        id=2,
        name="Coke",
        deprecated=True,
        price=Decimal("3.20"),
        category=None
    )

    ALL = [WATER, COKE]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    BEER_MIN = MODEL(
        id=3,
        name="Beer",
        deprecated=False,
        price=Decimal("3.60"),
        category=None
    )

    BEER_MAX = MODEL(
        id=3,
        name="Beer",
        deprecated=True,
        price=Decimal("3.60"),
        category=TestCategories.HARD_DRINKS
    )
