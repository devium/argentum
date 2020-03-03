from api.models.tag import Tag
from api.tests.data.guests import TestGuests
from api.tests.utils.test_objects import TestObjects


class TestTags(TestObjects):
    MODEL = Tag

    # Assume the real tag "1" was lost.
    TWO = MODEL(
        id=1,
        label=2,
        guest=TestGuests.ROBY
    )

    THREE = MODEL(
        id=2,
        label=3,
        guest=TestGuests.SHEELAH
    )

    ALL = [TWO, THREE]
