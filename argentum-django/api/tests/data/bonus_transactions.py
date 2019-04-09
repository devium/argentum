from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.bonus_transaction import BonusTransaction
from api.tests.data.guests import ROBY, SHEELAH

BTX1 = BonusTransaction(
    id=1,
    time=parse_datetime('2019-12-31T22:01:00Z'),
    guest=ROBY,
    value=Decimal('15.00'),
    description='staff bonus'
)

BTX2 = BonusTransaction(
    id=2,
    time=parse_datetime('2019-12-31T22:02:30Z'),
    guest=SHEELAH,
    value=Decimal('3.00'),
    description='guest bonus',
    pending=False
)

BONUS_TRANSACTIONS = [BTX1, BTX2]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

BTX3 = BonusTransaction(
    id=3,
    guest=ROBY,
    value=Decimal('4.00'),
    description='staff bonus',
    pending=True
)
