from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.guest import Guest
from api.tests.utils.test_objects import TestObjects


class TestGuests(TestObjects):
    MODEL = Guest

    ROBY = MODEL(
        id=1,
        code='DEMO-00001',
        name='Roby Brushfield',
        mail='rbrushfield0@sohu.com',
        status='staff',
        checked_in=parse_datetime('2019-12-31T22:55:44Z'),
        card='567a',
        balance=Decimal('4.50'),
        bonus=Decimal('0.00')
    )

    SHEELAH = MODEL(
        id=2,
        code='DEMO-00002',
        name='Sheelah Arnault',
        mail='sarnault1@tuttocitta.it',
        status='pending',
        checked_in=None,
        card=None,
        balance=Decimal('7.00'),
        bonus=Decimal('2.00')
    )

    ALL = [ROBY, SHEELAH]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    JOHANNA_MIN = MODEL(
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

    JOHANNA_MAX = MODEL(
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

    ROBY_PATCHED = MODEL(
        id=1,
        code='DEMO-00001',
        name='Toby Brushfield',
        mail='tbrushfield0@sohu.com',
        status='paid',
        checked_in=parse_datetime('2019-12-31T22:55:44Z'),
        card='567a',
        balance=Decimal('4.50'),
        bonus=Decimal('0.00')
    )
