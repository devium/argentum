from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.order import Order
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestOrders(TestObjects):
    MODEL = Order

    TAG_REGISTRATION_TWO: MODEL
    TAG_REGISTRATION_THREE: MODEL
    ONE_WATER_PLUS_TIP: MODEL
    TWO_COKES_PLUS_TIP: MODEL
    TAG_REGISTRATION_FOUR: MODEL
    TAG_REGISTRATION_FIVE: MODEL

    ONE_WATER_PLUS_TIP_CANCELLED: MODEL
    TWO_COKES_PLUS_TIP_COMMITTED: MODEL
    ONE_WATER_ONE_COKE_PLUS_TIP: MODEL
    ONE_WATER_ONE_COKE_PLUS_TIP_COMMITTED: MODEL

    @classmethod
    def init(cls):
        cls.TAG_REGISTRATION_TWO = Order(
            id=18010,
            time=parse_datetime('2019-12-31T22:07:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.00'),
            custom_current=Decimal('0.00'),
            pending=False
        )

        cls.TAG_REGISTRATION_THREE = Order(
            id=18020,
            time=parse_datetime('2019-12-31T22:09:00Z'),
            guest=TestGuests.SHEELAH,
            custom_initial=Decimal('0.00'),
            custom_current=Decimal('0.00'),
            pending=False
        )

        cls.ONE_WATER_PLUS_TIP = Order(
            id=18030,
            time=parse_datetime('2019-12-31T22:10:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.20'),
            custom_current=Decimal('0.20'),
            pending=False
        )

        cls.TWO_COKES_PLUS_TIP = Order(
            id=18040,
            time=parse_datetime('2019-12-31T22:14:00Z'),
            guest=TestGuests.SHEELAH,
            custom_initial=Decimal('0.60'),
            custom_current=Decimal('0.60'),
            pending=True
        )

        cls.TAG_REGISTRATION_FOUR = Order(
            id=18050,
            time=parse_datetime('2019-12-31T22:15:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.00'),
            custom_current=Decimal('0.00'),
            pending=True
        )

        cls.TAG_REGISTRATION_FIVE = Order(
            id=18060,
            time=parse_datetime('2019-12-31T22:19:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.00'),
            custom_current=Decimal('0.00'),
            pending=True
        )

        cls.SAVED = [
            cls.TAG_REGISTRATION_TWO,
            cls.TAG_REGISTRATION_THREE,
            cls.ONE_WATER_PLUS_TIP,
            cls.TWO_COKES_PLUS_TIP,
            cls.TAG_REGISTRATION_FOUR,
            cls.TAG_REGISTRATION_FIVE
        ]

        cls.ONE_WATER_PLUS_TIP_CANCELLED = Order(
            id=18031,
            time=parse_datetime('2019-12-31T22:10:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.20'),
            custom_current=Decimal('0.05'),
            pending=False
        )

        cls.TWO_COKES_PLUS_TIP_COMMITTED = Order(
            id=18041,
            time=parse_datetime('2019-12-31T22:14:00Z'),
            guest=TestGuests.SHEELAH,
            custom_initial=Decimal('0.60'),
            custom_current=Decimal('0.60'),
            pending=False
        )

        cls.ONE_WATER_ONE_COKE_PLUS_TIP = Order(
            id=18070,
            time=parse_datetime('2019-12-31T22:17:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.40'),
            custom_current=Decimal('0.40'),
            pending=True
        )

        cls.ONE_WATER_ONE_COKE_PLUS_TIP_COMMITTED = Order(
            id=18071,
            time=parse_datetime('2019-12-31T22:17:00Z'),
            guest=TestGuests.ROBY,
            custom_initial=Decimal('0.40'),
            custom_current=Decimal('0.40'),
            pending=False
        )

        cls.UNSAVED = [
            cls.ONE_WATER_PLUS_TIP_CANCELLED,
            cls.TWO_COKES_PLUS_TIP_COMMITTED,
            cls.ONE_WATER_ONE_COKE_PLUS_TIP,
            cls.ONE_WATER_ONE_COKE_PLUS_TIP_COMMITTED
        ]
