from api.models.status import Status
from api.tests.utils.test_objects import TestObjects


class TestStatuses(TestObjects):
    MODEL = Status

    PAID = MODEL(
        id=1,
        internal_name='paid',
        display_name='Paid',
        color='#00ff00'
    )

    PENDING = MODEL(
        id=2,
        internal_name='pending',
        display_name='Pending',
        color='#ff0000'
    )

    ALL = [PAID, PENDING]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    STAFF = MODEL(
        id=3,
        internal_name='staff',
        display_name='Staff',
        color='#0000ff',
    )

    PENDING_PATCHED = MODEL(
        id=2,
        internal_name='pen',
        display_name='Pending',
        color='#ff0000'
    )
