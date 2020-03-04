from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.order import Order
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestOrders(TestObjects):
    MODEL = Order

    TAG_REGISTRATION_TWO = Order(
        id=1,
        time=parse_datetime('2019-12-31T22:07:00Z'),
        guest=TestGuests.ROBY,
        custom_initial=Decimal('0.00'),
        custom_current=Decimal('0.00'),
        pending=False
    )

    TAG_REGISTRATION_THREE = Order(
        id=2,
        time=parse_datetime('2019-12-31T22:09:00Z'),
        guest=TestGuests.SHEELAH,
        custom_initial=Decimal('0.00'),
        custom_current=Decimal('0.00'),
        pending=False
    )

    ONE_WATER_PLUS_TIP = Order(
        id=3,
        time=parse_datetime('2019-12-31T22:10:00Z'),
        guest=TestGuests.ROBY,
        custom_initial=Decimal('0.20'),
        custom_current=Decimal('0.20'),
        pending=False
    )

    TWO_COKES_PLUS_TIP = Order(
        id=4,
        time=parse_datetime('2019-12-31T22:14:00Z'),
        guest=TestGuests.SHEELAH,
        custom_initial=Decimal('0.60'),
        custom_current=Decimal('0.60'),
        pending=True
    )

    ALL = [TAG_REGISTRATION_TWO, TAG_REGISTRATION_THREE, ONE_WATER_PLUS_TIP, TWO_COKES_PLUS_TIP]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    ONE_WATER_ONE_COKE_PLUS_TIP = Order(
        id=5,
        time=parse_datetime('2019-12-31T22:17:00Z'),
        guest=TestGuests.SHEELAH,
        custom_initial=Decimal('0.40'),
        custom_current=Decimal('0.40'),
        pending=True
    )
