from django.utils import timezone

from api.models import Transaction
from api.tests.data.guests import ROBY, SHEELAH

TX1 = Transaction(
    id=1,
    time=timezone.make_aware(timezone.datetime(2018, 12, 31, 22, 5, 0)),
    guest=ROBY,
    value='3.00',
    description='initial'
)

TX2 = Transaction(
    id=2,
    time=timezone.make_aware(timezone.datetime(2018, 12, 31, 22, 7, 30)),
    guest=SHEELAH,
    value='7.00',
    description='initial',
    pending=False
)

TRANSACTIONS = [TX1, TX2]

TX3 = Transaction(
    id=3,
    guest=ROBY,
    value='5.00',
    description='topup',
    pending=True
)
