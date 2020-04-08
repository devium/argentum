from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.utils.test_objects import TestObjects


class TestTransactions(TestObjects):
    MODEL = Transaction

    TX1: MODEL
    TX_COAT_CHECK_1: MODEL
    TX2: MODEL
    TX_COAT_CHECK_2: MODEL
    TX_ORDER_1: MODEL
    TX3: MODEL

    TX3_COMMITTED: MODEL
    TX4: MODEL
    TX_ORDER_2: MODEL
    TX_CANCEL_1: MODEL
    TX_CANCEL_2: MODEL
    TX_COAT_CHECK_3: MODEL

    @classmethod
    def init(cls):
        cls.TX1 = cls.MODEL(
            id=20010,
            time=parse_datetime('2019-12-31T22:05:00Z'),
            guest=TestGuests.ROBY,
            value=Decimal('9.00'),
            ignore_bonus=False,
            description='default',
            order=None,
            pending=False
        )

        cls.TX_COAT_CHECK_1 = cls.MODEL(
            id=20020,
            time=parse_datetime('2019-12-31T22:07:00Z'),
            guest=TestGuests.ROBY,
            value=Decimal('-1.00'),
            ignore_bonus=False,
            description='order',
            order=TestOrders.TAG_REGISTRATION_TWO,
            pending=False
        )

        cls.TX2 = cls.MODEL(
            id=20030,
            time=parse_datetime('2019-12-31T22:07:30Z'),
            guest=TestGuests.SHEELAH,
            value=Decimal('5.00'),
            ignore_bonus=True,
            description='default',
            order=None,
            pending=False
        )

        cls.TX_COAT_CHECK_2 = cls.MODEL(
            id=20040,
            time=parse_datetime('2019-12-31T22:09:00Z'),
            guest=TestGuests.SHEELAH,
            value=Decimal('-1.00'),
            ignore_bonus=False,
            description='order',
            order=TestOrders.TAG_REGISTRATION_THREE,
            pending=False
        )

        cls.TX_ORDER_1 = cls.MODEL(
            id=20050,
            time=parse_datetime('2019-12-31T22:10:00Z'),
            guest=TestGuests.ROBY,
            value=Decimal('-3.00'),
            ignore_bonus=False,
            description='order',
            order=TestOrders.ONE_WATER_PLUS_TIP,
            pending=False
        )

        cls.TX3 = cls.MODEL(
            id=20060,
            time=parse_datetime('2019-12-31T22:30:00Z'),
            guest=TestGuests.SHEELAH,
            value=Decimal('-5.00'),
            ignore_bonus=False,
            description='default',
            order=None,
            pending=True
        )

        cls.SAVED = [cls.TX1, cls.TX_COAT_CHECK_1, cls.TX2, cls.TX_COAT_CHECK_2, cls.TX_ORDER_1, cls.TX3]

        cls.TX3_COMMITTED = cls.MODEL(
            id=20061,
            guest=TestGuests.SHEELAH,
            value=Decimal('-5.00'),
            ignore_bonus=False,
            description='default',
            order=None,
            pending=False
        )

        cls.TX4 = cls.MODEL(
            id=20070,
            guest=TestGuests.ROBY,
            value=Decimal('5.00'),
            ignore_bonus=False,
            description='default',
            order=None,
            pending=True
        )

        cls.TX_ORDER_2 = cls.MODEL(
            id=20080,
            guest=TestGuests.SHEELAH,
            value=Decimal('-7.00'),
            ignore_bonus=False,
            description='order',
            order=TestOrders.TWO_COKES_PLUS_TIP,
            pending=False
        )

        cls.TX_CANCEL_1 = cls.MODEL(
            id=20090,
            guest=TestGuests.ROBY,
            value=Decimal('0.15'),
            ignore_bonus=False,
            description='cancel',
            order=TestOrders.ONE_WATER_PLUS_TIP,
            pending=False
        )

        cls.TX_CANCEL_2 = cls.MODEL(
            id=20100,
            guest=TestGuests.ROBY,
            value=Decimal('2.40'),
            ignore_bonus=False,
            description='cancel',
            order=TestOrders.ONE_WATER_PLUS_TIP,
            pending=False
        )

        cls.TX_COAT_CHECK_3 = cls.MODEL(
            id=20110,
            guest=TestGuests.ROBY,
            value=Decimal('-1.00'),
            ignore_bonus=False,
            description='order',
            order=TestOrders.TAG_REGISTRATION_FOUR,
            pending=False
        )

        cls.UNSAVED = [
            cls.TX3_COMMITTED,
            cls.TX4,
            cls.TX_ORDER_2,
            cls.TX_CANCEL_1,
            cls.TX_CANCEL_2,
            cls.TX_COAT_CHECK_3
        ]
