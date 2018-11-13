from django.utils.dateparse import parse_datetime

from api.models import Transaction
from api.tests.data.guests import ROBY, SHEELAH

TX1 = Transaction(
    id=1,
    time=parse_datetime('2019-12-31T22:05:00Z'),
    guest=ROBY,
    value='3.00',
    ignore_bonus=False,
    description='initial'
)

TX2 = Transaction(
    id=2,
    time=parse_datetime('2019-12-31T22:07:30Z'),
    guest=SHEELAH,
    value='7.00',
    ignore_bonus=True,
    description='initial',
    pending=False
)

TRANSACTIONS = [TX1, TX2]

TX3 = Transaction(
    id=3,
    guest=ROBY,
    value='5.00',
    ignore_bonus=False,
    description='topup',
    pending=True
)
