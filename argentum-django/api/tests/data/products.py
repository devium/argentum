from decimal import Decimal

from api.models.product import Product
from api.tests.data.categories import SOFT_DRINKS, HARD_DRINKS

WATER = Product(
    id=1,
    name="Water",
    deprecated=False,
    price=Decimal("2.40"),
    category=SOFT_DRINKS
)

COKE = Product(
    id=2,
    name="Coke",
    deprecated=True,
    price=Decimal("3.20"),
    category=None
)

PRODUCTS = [WATER, COKE]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

BEER_MIN = Product(
    id=3,
    name="Beer",
    deprecated=False,
    price=Decimal("3.60"),
    category=None
)

BEER_MAX = Product(
    id=3,
    name="Beer",
    deprecated=True,
    price=Decimal("3.60"),
    category=HARD_DRINKS
)
