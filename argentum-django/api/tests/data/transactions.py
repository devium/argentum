from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestTransactions(TestObjects):
    MODEL = Transaction

    TX1 = MODEL(
        id=1,
        time=parse_datetime('2019-12-31T22:05:00Z'),
        guest=TestGuests.ROBY,
        value=Decimal('3.00'),
        ignore_bonus=False,
        description='initial'
    )

    TX2 = MODEL(
        id=2,
        time=parse_datetime('2019-12-31T22:07:30Z'),
        guest=TestGuests.SHEELAH,
        value=Decimal('7.00'),
        ignore_bonus=True,
        description='initial',
        pending=False
    )

    ALL = [TX1, TX2]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    # Time is set by the server.
    TX3 = MODEL(
        id=3,
        guest=TestGuests.ROBY,
        value=Decimal('5.00'),
        ignore_bonus=False,
        description='topup',
        pending=True
    )
