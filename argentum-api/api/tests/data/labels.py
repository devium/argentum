from api.models.label import Label
from api.tests.data.tag_registrations import TestTagRegistrations
from api.tests.utils.test_objects import TestObjects


class TestLabels(TestObjects):
    # Labels don't get their own test but are instead tested as fields of TagRegistration.
    MODEL = Label

    TWO_FIRST: MODEL
    THREE_FIRST: MODEL
    FOUR_FIRST: MODEL

    FIVE_FIRST: MODEL
    THREE_SECOND: MODEL

    @classmethod
    def init(cls):
        cls.TWO_FIRST = Label(id=25010, value=2, tag_registration=TestTagRegistrations.ROBY_TWO)
        cls.THREE_FIRST = Label(id=25020, value=3, tag_registration=TestTagRegistrations.SHEELAH_THREE)
        cls.FOUR_FIRST = Label(id=25030, value=4, tag_registration=TestTagRegistrations.ROBY_FOUR)

        cls.SAVED = [cls.TWO_FIRST, cls.THREE_FIRST, cls.FOUR_FIRST]

        cls.FIVE_FIRST = Label(id=25040, value=5, tag_registration=TestTagRegistrations.ROBY_FIVE)
        cls.THREE_SECOND = Label(id=25050, value=3, tag_registration=TestTagRegistrations.ROBY_THREE_STEAL)

        cls.UNSAVED = [cls.FIVE_FIRST, cls.THREE_SECOND]
