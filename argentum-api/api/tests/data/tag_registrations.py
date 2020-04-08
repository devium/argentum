from django.utils.dateparse import parse_datetime

from api.models import TagRegistration
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.utils.test_objects import TestObjects


class TestTagRegistrations(TestObjects):
    MODEL = TagRegistration

    ROBY_TWO: MODEL
    SHEELAH_THREE: MODEL
    ROBY_FOUR: MODEL

    ROBY_FOUR_COMMITTED: MODEL
    ROBY_FIVE: MODEL
    ROBY_THREE_STEAL: MODEL
    ROBY_THREE_STEAL_COMMITTED: MODEL

    @classmethod
    def init(cls):
        cls.ROBY_TWO = TagRegistration(
            id=24010,
            time=parse_datetime('2019-12-31T22:07:01Z'),
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_TWO,
            pending=False
        )

        cls.SHEELAH_THREE = TagRegistration(
            id=24020,
            time=parse_datetime('2019-12-31T22:09:01Z'),
            guest=TestGuests.SHEELAH,
            order=TestOrders.TAG_REGISTRATION_THREE,
            pending=False
        )

        cls.ROBY_FOUR = TagRegistration(
            id=24030,
            time=parse_datetime('2019-12-31T22:15:01Z'),
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_FOUR,
            pending=True
        )

        cls.SAVED = [cls.ROBY_TWO, cls.SHEELAH_THREE, cls.ROBY_FOUR]

        cls.ROBY_FOUR_COMMITTED = TagRegistration(
            id=24031,
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_FOUR,
            pending=False
        )

        cls.ROBY_FIVE = TagRegistration(
            id=24040,
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_FIVE,
            pending=True
        )

        cls.ROBY_THREE_STEAL = TagRegistration(
            id=24050,
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_FOUR,
            pending=True
        )

        cls.ROBY_THREE_STEAL_COMMITTED = TagRegistration(
            id=24051,
            guest=TestGuests.ROBY,
            order=TestOrders.TAG_REGISTRATION_FOUR,
            pending=False
        )

        cls.UNSAVED = [cls.ROBY_FOUR_COMMITTED, cls.ROBY_FIVE, cls.ROBY_THREE_STEAL, cls.ROBY_THREE_STEAL_COMMITTED]
