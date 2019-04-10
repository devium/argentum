from collections import namedtuple

from api.tests.utils.test_objects import TestObjects


class TestUsers(TestObjects):
    PlainUser = namedtuple('PlainUser', ['id', 'username', 'password', 'groups'])
    MODEL = PlainUser
    INIT_DB = False

    ADMIN = MODEL(id=1, username='admin', password='argentum', groups=['admin'])
    BAR = MODEL(id=2, username='bar', password='bar1', groups=['order'])
    WARDROBE = MODEL(id=3, username='wardrobe', password='wardrobe1', groups=['coat_check'])
    RECEPTION = MODEL(id=4, username='reception', password='reception1', groups=['check_in'])
    TOPUP = MODEL(id=5, username='topup', password='topup1', groups=['transfer'])
    TERMINAL = MODEL(id=6, username='terminal', password='terminal1', groups=['scan'])

    ALL = [ADMIN, BAR, WARDROBE, RECEPTION, TOPUP, TERMINAL]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.
    BUFFET = MODEL(id=7, username='buffet', password='buffet1', groups=['order'])
    WARDROBE_PATCHED = MODEL(id=3, username='giftshop', password='giftshop1', groups=['order', 'check_in'])
