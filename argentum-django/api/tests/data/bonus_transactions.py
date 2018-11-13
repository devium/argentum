from django.utils.dateparse import parse_datetime

from api.models.bonus_transaction import BonusTransaction
from api.tests.data.guests import ROBY, SHEELAH

BTX1 = BonusTransaction(
    id=1,
    time=parse_datetime('2019-12-31T22:01:00Z'),
    guest=ROBY,
    value='15.00',
    description='staff bonus'
)

BTX2 = BonusTransaction(
    id=2,
    time=parse_datetime('2019-12-31T22:02:30Z'),
    guest=SHEELAH,
    value='3.00',
    description='guest bonus',
    pending=False
)

BONUS_TRANSACTIONS = [BTX1, BTX2]

BTX3 = BonusTransaction(
    id=3,
    guest=ROBY,
    value='4.00',
    description='staff bonus',
    pending=True
)
