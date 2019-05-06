from decimal import Decimal

from api.models.discount import Discount
from api.tests.data.categories import TestCategories
from api.tests.data.statuses import TestStatuses
from api.tests.utils.test_objects import TestObjects


class TestDiscounts(TestObjects):
    MODEL = Discount

    PAID_SOFT_DRINKS = MODEL(
        id=1,
        status=TestStatuses.PAID,
        category=TestCategories.SOFT_DRINKS,
        rate=Decimal('0.10')
    )

    PENDING_HARD_DRINKS = MODEL(
        id=2,
        status=TestStatuses.PENDING,
        category=TestCategories.HARD_DRINKS,
        rate=Decimal('0.25')
    )

    ALL = [PAID_SOFT_DRINKS, PENDING_HARD_DRINKS]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    PENDING_SOFT_DRINKS = MODEL(
        id=3,
        status=TestStatuses.PENDING,
        category=TestCategories.SOFT_DRINKS,
        rate=Decimal('0.20')
    )

    PAID_SOFT_DRINKS_PATCHED = MODEL(
        id=1,
        status=TestStatuses.PAID,
        category=TestCategories.SOFT_DRINKS,
        rate=Decimal('0.40')
    )
