from collections import namedtuple

from api.tests.utils.test_objects import TestObjects


class TestGroups(TestObjects):
    PlainGroup = namedtuple('PlainGroup', ['id', 'name'])
    MODEL = PlainGroup
    INIT_DB = False

    # These models are created in the initial Django signal, not from this data. These are just for easy handling.
    ADMIN = MODEL(id=1, name='admin')
    ORDER = MODEL(id=2, name='order')
    COAT_CHECK = MODEL(id=3, name='coat_check')
    CHECK_IN = MODEL(id=4, name='check_in')
    TRANSFER = MODEL(id=5, name='transfer')
    SCAN = MODEL(id=6, name='scan')

    ALL = [ADMIN, ORDER, COAT_CHECK, CHECK_IN, TRANSFER, SCAN]
