from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.bonus_transaction import BonusTransaction
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestBonusTransactions(TestObjects):
    MODEL = BonusTransaction

    BTX1: MODEL
    BTX2: MODEL
    BTX3: MODEL

    BTX3_COMMITTED: MODEL
    BTX4: MODEL

    @classmethod
    def init(cls):
        cls.BTX1 = cls.MODEL(
            id=21010,
            time=parse_datetime('2019-12-31T22:01:00Z'),
            guest=TestGuests.ROBY,
            value=Decimal('2.50'),
            description='default',
            pending=False
        )

        cls.BTX2 = cls.MODEL(
            id=21020,
            time=parse_datetime('2019-12-31T22:02:30Z'),
            guest=TestGuests.SHEELAH,
            value=Decimal('3.00'),
            description='default',
            pending=False
        )

        cls.BTX3 = cls.MODEL(
            id=21030,
            time=parse_datetime('2019-12-31T22:03:00Z'),
            guest=TestGuests.ROBY,
            value=Decimal('3.00'),
            description='default',
            pending=True
        )

        cls.SAVED = [cls.BTX1, cls.BTX2, cls.BTX3]

        cls.BTX3_COMMITTED = cls.MODEL(
            id=21031,
            guest=TestGuests.ROBY,
            value=Decimal('3.00'),
            description='default',
            pending=False
        )

        cls.BTX4 = cls.MODEL(
            id=21040,
            guest=TestGuests.ROBY,
            value=Decimal('4.00'),
            description='default',
            pending=True
        )

        cls.UNSAVED = [cls.BTX3_COMMITTED, cls.BTX4]
