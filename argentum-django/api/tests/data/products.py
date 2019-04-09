from decimal import Decimal

from api.models.product import Product
from api.tests.data.categories import SOFT_DRINKS

WATER = Product(
    id=1,
    name="Water",
    price=Decimal("2.40"),
    category=SOFT_DRINKS
)

COKE = Product(
    id=2,
    name="Coke",
    price=Decimal("3.20"),
    category=None
)

PRODUCTS = [WATER, COKE]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

WATER_MIN = Product(
    id=3,
    name="Water",
    price=Decimal("2.40"),
    category=None
)

WATER_MAX = Product(
    id=4,
    name="Water",
    price=Decimal("2.40"),
    category=SOFT_DRINKS
)
