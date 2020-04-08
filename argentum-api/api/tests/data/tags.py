from api.models.tag import Tag
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestTags(TestObjects):
    MODEL = Tag

    # Assume the real tag "1" was lost.
    TWO: MODEL
    THREE: MODEL

    THREE_STOLEN: MODEL
    FOUR: MODEL
    FIVE: MODEL

    @classmethod
    def init(cls):
        # Assume the real tag "1" was lost.
        cls.TWO = cls.MODEL(
            id=23010,
            label=2,
            guest=TestGuests.ROBY
        )

        cls.THREE = cls.MODEL(
            id=23020,
            label=3,
            guest=TestGuests.SHEELAH
        )

        cls.SAVED = [cls.TWO, cls.THREE]

        cls.THREE_STOLEN = cls.MODEL(
            id=23021,
            label=3,
            guest=TestGuests.ROBY
        )

        cls.FOUR = cls.MODEL(
            id=23030,
            label=4,
            guest=TestGuests.ROBY
        )

        cls.FIVE = cls.MODEL(
            id=23040,
            label=5,
            guest=TestGuests.ROBY
        )

        cls.UNSAVED = [cls.THREE_STOLEN, cls.FOUR, cls.FIVE]
