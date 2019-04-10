from api.models.status import Status

PAID = Status(
    id=1,
    internal_name='paid',
    display_name='Paid',
    color='#00ff00'
)

PENDING = Status(
    id=2,
    internal_name='pending',
    display_name='Pending',
    color='#ff0000'
)

STATUSES = [PAID, PENDING]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

STAFF = Status(
    id=3,
    internal_name='staff',
    display_name='Staff',
    color='#0000ff',
)
