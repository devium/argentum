from api.models.status import Status
from api.tests.utils.test_objects import TestObjects


class TestStatuses(TestObjects):
    MODEL = Status

    PAID: MODEL
    PENDING: MODEL

    STAFF: MODEL
    PENDING_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.PAID = cls.MODEL(
            id=16010,
            internal_name='paid',
            display_name='Paid',
            color='#00ff00'
        )

        cls.PENDING = cls.MODEL(
            id=16020,
            internal_name='pending',
            display_name='Pending',
            color='#ff0000'
        )

        cls.SAVED = [cls.PAID, cls.PENDING]

        cls.STAFF = cls.MODEL(
            id=16030,
            internal_name='staff',
            display_name='Staff',
            color='#0000ff',
        )

        cls.PENDING_PATCHED = cls.MODEL(
            id=16021,
            internal_name='pen',
            display_name='Pending',
            color='#ff0000'
        )

        cls.UNSAVED = [cls.STAFF, cls.PENDING_PATCHED]
