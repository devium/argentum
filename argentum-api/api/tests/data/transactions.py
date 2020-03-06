from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.utils.test_objects import TestObjects


class TestTransactions(TestObjects):
    MODEL = Transaction

    TX1 = MODEL(
        id=1,
        time=parse_datetime('2019-12-31T22:05:00Z'),
        guest=TestGuests.ROBY,
        value=Decimal('9.00'),
        ignore_bonus=False,
        description='default',
        order=None,
        pending=False
    )

    TX_COAT_CHECK_1 = MODEL(
        id=2,
        time=parse_datetime('2019-12-31T22:07:00Z'),
        guest=TestGuests.ROBY,
        value=Decimal('-1.00'),
        ignore_bonus=False,
        description='order',
        order=TestOrders.TAG_REGISTRATION_TWO,
        pending=False
    )

    TX2 = MODEL(
        id=3,
        time=parse_datetime('2019-12-31T22:07:30Z'),
        guest=TestGuests.SHEELAH,
        value=Decimal('5.00'),
        ignore_bonus=True,
        description='default',
        order=None,
        pending=False
    )

    TX_COAT_CHECK_2 = MODEL(
        id=4,
        time=parse_datetime('2019-12-31T22:09:00Z'),
        guest=TestGuests.SHEELAH,
        value=Decimal('-1.00'),
        ignore_bonus=False,
        description='order',
        order=TestOrders.TAG_REGISTRATION_THREE,
        pending=False
    )

    TX_ORDER_1 = MODEL(
        id=5,
        time=parse_datetime('2019-12-31T22:10:00Z'),
        guest=TestGuests.ROBY,
        value=Decimal('-3.00'),
        ignore_bonus=False,
        description='order',
        order=TestOrders.ONE_WATER_PLUS_TIP,
        pending=False
    )

    TX3 = MODEL(
        id=6,
        time=parse_datetime('2019-12-31T22:30:00Z'),
        guest=TestGuests.SHEELAH,
        value=Decimal('-5.00'),
        ignore_bonus=False,
        description='default',
        order=None,
        pending=True
    )

    ALL = [TX1, TX_COAT_CHECK_1, TX2, TX_COAT_CHECK_2, TX_ORDER_1, TX3]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    # Time is set by the server.
    TX4 = MODEL(
        id=7,
        guest=TestGuests.ROBY,
        value=Decimal('5.00'),
        ignore_bonus=False,
        description='default',
        order=None,
        pending=True
    )

    TX_ORDER_2 = MODEL(
        id=7,
        guest=TestGuests.SHEELAH,
        value=Decimal('-7.00'),
        ignore_bonus=False,
        description='order',
        order=TestOrders.TWO_COKES_PLUS_TIP,
        pending=False
    )

    TX_CANCEL_1 = MODEL(
        id=7,
        guest=TestGuests.ROBY,
        value=Decimal('0.15'),
        ignore_bonus=False,
        description='cancel',
        order=TestOrders.ONE_WATER_PLUS_TIP,
        pending=False
    )

    TX_CANCEL_2 = MODEL(
        id=7,
        guest=TestGuests.ROBY,
        value=Decimal('2.40'),
        ignore_bonus=False,
        description='cancel',
        order=TestOrders.ONE_WATER_PLUS_TIP,
        pending=False
    )
