from django.utils.dateparse import parse_datetime

from api.models import TagRegistration
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.utils.test_objects import TestObjects


class TestTagRegistrations(TestObjects):
    MODEL = TagRegistration

    ROBY_TWO = TagRegistration(
        id=1,
        time=parse_datetime('2019-12-31T22:07:01Z'),
        label=2,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_TWO,
        pending=False
    )

    SHEELAH_THREE = TagRegistration(
        id=2,
        time=parse_datetime('2019-12-31T22:09:01Z'),
        label=3,
        guest=TestGuests.SHEELAH,
        order=TestOrders.TAG_REGISTRATION_THREE,
        pending=False
    )

    ALL = [ROBY_TWO, SHEELAH_THREE]
