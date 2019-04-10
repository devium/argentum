from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models import Guest

ROBY = Guest(
    id=1,
    code='DEMO-00001',
    name='Roby Brushfield',
    mail='rbrushfield0@sohu.com',
    status='staff',
    checked_in=parse_datetime('2019-12-31T22:55:44Z'),
    card='567a',
    balance=Decimal('-62.94'),
    bonus=Decimal('-22.09')
)

SHEELAH = Guest(
    id=2,
    code='DEMO-00002',
    name='Sheelah Arnault',
    mail='sarnault1@tuttocitta.it',
    status='pending',
    checked_in=None,
    card=None,
    balance=Decimal('-73.04'),
    bonus=Decimal('54.82')
)

GUESTS = [ROBY, SHEELAH]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

JOHANNA_MIN = Guest(
    id=3,
    code='DEMO-00003',
    name='Johanna Doe',
    mail='jdoe2@tinypic.com',
    status='paid',
    checked_in=None,
    card=None,
    balance=Decimal('0.00'),
    bonus=Decimal('0.00')
)

JOHANNA_MAX = Guest(
    id=3,
    code='DEMO-00003',
    name='Johanna Doe',
    mail='jdoe2@tinypic.com',
    status='paid',
    checked_in=parse_datetime('2019-12-31T23:13:52Z'),
    card='581a',
    balance=Decimal('81.62'),
    bonus=Decimal('69.11')
)

ROBY_PATCHED = Guest(
    id=1,
    code='DEMO-00001',
    name='Toby Brushfield',
    mail='tbrushfield0@sohu.com',
    status='paid',
    checked_in=parse_datetime('2019-12-31T22:55:44Z'),
    card='567a',
    balance=Decimal('-62.94'),
    bonus=Decimal('-22.09')
)
