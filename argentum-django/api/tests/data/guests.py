from django.utils import timezone

from api.models import Guest

NORBERT = Guest(
    id=1,
    code='C-VVNORB',
    name='Norbert the Waterbear',
    mail='norby@smellywaterbear.com',
    status='default',
    checked_in=None,
    card='7951068',  # 12121212
    balance='7.60',
    bonus='0.00'
)

JIMMY = Guest(
    id=2,
    code='C-VVJAMES',
    name='James the Sunderer',
    mail='jimmy@cherpcherp.com',
    status='default',
    checked_in=timezone.make_aware(timezone.datetime(2018, 12, 31, 22, 0, 0)),
    card='8102162',  # 12341234
    balance='10.00',
    bonus='5.00'
)

GUESTS = [NORBERT, JIMMY]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

NORBERT_DEFAULT = Guest(
    id=3,
    code='C-VVNORB',
    name='Norbert the Waterbear',
    mail='norby@smellywaterbear.com',
    status='default',
    checked_in=None,
    card='',
    balance='0.00',
    bonus='0.00'
)

JIMMY_EXPLICIT = Guest(
    id=4,
    code='C-VVJAMES',
    name='James the Sunderer',
    mail='jimmy@cherpcherp.com',
    status='default',
    checked_in=timezone.make_aware(timezone.datetime(2018, 12, 31, 22, 0, 0)),
    card='8102162',  # 12341234
    balance='10.00',
    bonus='5.00'
)
