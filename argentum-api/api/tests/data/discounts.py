from decimal import Decimal

from api.models.discount import Discount
from api.tests.data.categories import TestCategories
from api.tests.data.statuses import TestStatuses
from api.tests.utils.test_objects import TestObjects


class TestDiscounts(TestObjects):
    MODEL = Discount

    PAID_SOFT_DRINKS: MODEL
    PENDING_HARD_DRINKS: MODEL

    PENDING_SOFT_DRINKS: MODEL
    PAID_SOFT_DRINKS_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.PAID_SOFT_DRINKS = cls.MODEL(
            id=22010,
            status=TestStatuses.PAID,
            category=TestCategories.SOFT_DRINKS,
            rate=Decimal('0.10')
        )

        cls.PENDING_HARD_DRINKS = cls.MODEL(
            id=22020,
            status=TestStatuses.PENDING,
            category=TestCategories.HARD_DRINKS,
            rate=Decimal('0.25')
        )

        cls.SAVED = [cls.PAID_SOFT_DRINKS, cls.PENDING_HARD_DRINKS]

        cls.PENDING_SOFT_DRINKS = cls.MODEL(
            id=22030,
            status=TestStatuses.PENDING,
            category=TestCategories.SOFT_DRINKS,
            rate=Decimal('0.20')
        )

        cls.PAID_SOFT_DRINKS_PATCHED = cls.MODEL(
            id=22011,
            status=TestStatuses.PAID,
            category=TestCategories.SOFT_DRINKS,
            rate=Decimal('0.40')
        )

        cls.UNSAVED = [cls.PENDING_SOFT_DRINKS, cls.PAID_SOFT_DRINKS_PATCHED]
