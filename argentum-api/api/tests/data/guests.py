from decimal import Decimal

from django.utils.dateparse import parse_datetime

from api.models.guest import Guest
from api.tests.data.statuses import TestStatuses
from api.tests.utils.test_objects import TestObjects


class TestGuests(TestObjects):
    MODEL = Guest

    ROBY: MODEL
    SHEELAH: MODEL

    JOHANNA_MIN: MODEL
    JOHANNA_MAX: MODEL
    ROBY_PATCHED: MODEL
    ROBY_LIST_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.ROBY = cls.MODEL(
            id=17010,
            code='DEMO-00001',
            name='Roby Brushfield',
            mail='rbrushfield0@sohu.com',
            status=TestStatuses.PAID,
            checked_in=parse_datetime('2019-12-31T22:55:44Z'),
            card='567a',
            balance=Decimal('7.50'),
            bonus=Decimal('0.00')
        )

        cls.SHEELAH = cls.MODEL(
            id=17020,
            code='DEMO-00002',
            name='Sheelah Arnault',
            mail='sarnault1@tuttocitta.it',
            status=TestStatuses.PENDING,
            checked_in=None,
            card=None,
            balance=Decimal('6.00'),
            bonus=Decimal('2.00')
        )

        cls.SAVED = [cls.ROBY, cls.SHEELAH]

        cls.JOHANNA_MIN = cls.MODEL(
            id=17030,
            code='DEMO-00003',
            name='Johanna Doe',
            mail='jdoe2@tinypic.com',
            status=None,
            checked_in=None,
            card=None,
            balance=Decimal('0.00'),
            bonus=Decimal('0.00')
        )

        cls.JOHANNA_MAX = cls.MODEL(
            id=17031,
            code='DEMO-00003',
            name='Johanna Doe',
            mail='jdoe2@tinypic.com',
            status=TestStatuses.PAID,
            checked_in=parse_datetime('2019-12-31T23:13:52Z'),
            card='581a',
            balance=Decimal('0.00'),
            bonus=Decimal('0.00')
        )

        cls.ROBY_PATCHED = cls.MODEL(
            id=17011,
            code='DEMO-00001',
            name='Roby Brushfield',
            mail='rbrushfield0@sohu.com',
            status=TestStatuses.PAID,
            checked_in=parse_datetime('2019-12-31T22:57:30Z'),
            card='567a',
            balance=Decimal('7.50'),
            bonus=Decimal('0.00')
        )

        cls.ROBY_LIST_PATCHED = cls.MODEL(
            id=17012,
            code='DEMO-00001',
            name='Toby Brushfield',
            mail='tbrushfield0@sohu.com',
            status=TestStatuses.PENDING,
            checked_in=parse_datetime('2019-12-31T22:55:44Z'),
            card='567a',
            balance=Decimal('7.50'),
            bonus=Decimal('0.00')
        )

        cls.UNSAVED = [cls.JOHANNA_MIN, cls.JOHANNA_MAX, cls.ROBY_PATCHED, cls.ROBY_LIST_PATCHED]
