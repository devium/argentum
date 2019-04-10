from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.bonus_transaction import BonusTransaction
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestBonusTransactions(TestObjects):
    MODEL = BonusTransaction

    BTX1 = MODEL(
        id=1,
        time=parse_datetime('2019-12-31T22:01:00Z'),
        guest=TestGuests.ROBY,
        value=Decimal('15.00'),
        description='staff bonus'
    )

    BTX2 = MODEL(
        id=2,
        time=parse_datetime('2019-12-31T22:02:30Z'),
        guest=TestGuests.SHEELAH,
        value=Decimal('3.00'),
        description='guest bonus',
        pending=False
    )

    ALL = [BTX1, BTX2]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    BTX3 = MODEL(
        id=3,
        guest=TestGuests.ROBY,
        value=Decimal('4.00'),
        description='staff bonus',
        pending=True
    )
