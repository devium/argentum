from django.utils.dateparse import parse_datetime

from api.models import TagRegistration
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.data.tags import TestTags
from api.tests.utils.test_objects import TestObjects


class TestTagRegistrations(TestObjects):
    MODEL = TagRegistration

    ROBY_TWO = TagRegistration(
        id=1,
        time=parse_datetime('2019-12-31T22:07:01Z'),
        label=TestTags.TWO.label,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_TWO,
        pending=False
    )

    SHEELAH_THREE = TagRegistration(
        id=2,
        time=parse_datetime('2019-12-31T22:09:01Z'),
        label=TestTags.THREE.label,
        guest=TestGuests.SHEELAH,
        order=TestOrders.TAG_REGISTRATION_THREE,
        pending=False
    )

    ROBY_FOUR = TagRegistration(
        id=3,
        time=parse_datetime('2019-12-31T22:15:01Z'),
        label=TestTags.FOUR.label,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_FOUR,
        pending=True
    )

    ALL = [ROBY_TWO, SHEELAH_THREE, ROBY_FOUR]

    ROBY_FOUR_COMMITTED = TagRegistration(
        id=3,
        label=TestTags.FOUR.label,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_FOUR,
        pending=False
    )

    ROBY_FIVE = TagRegistration(
        id=4,
        label=TestTags.FIVE.label,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_FIVE,
        pending=True
    )

    ROBY_THREE_STEAL = TagRegistration(
        id=4,
        label=TestTags.THREE.label,
        guest=TestGuests.ROBY,
        order=TestOrders.TAG_REGISTRATION_FOUR,
        pending=False
    )
