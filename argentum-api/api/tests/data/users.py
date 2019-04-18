from collections import namedtuple

from django.contrib.auth.models import User, Group

from api.tests.utils.test_objects import TestObjects


class TestUsers(TestObjects):
    PlainUser = namedtuple('PlainUser', ['id', 'username', 'password', 'groups'])
    MODEL = PlainUser

    ADMIN = PlainUser(id=1, username='admin', password='argentum', groups=['admin'])
    BAR = PlainUser(id=2, username='bar', password='bar1', groups=['order', 'product_range_1'])
    WARDROBE = PlainUser(id=3, username='wardrobe', password='wardrobe1', groups=['coat_check'])
    RECEPTION = PlainUser(id=4, username='reception', password='reception1', groups=['check_in'])
    TOPUP = PlainUser(id=5, username='topup', password='topup1', groups=['transfer'])
    TERMINAL = PlainUser(id=6, username='terminal', password='terminal1', groups=['scan'])

    ALL = [ADMIN, BAR, WARDROBE, RECEPTION, TOPUP, TERMINAL]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.
    BUFFET = MODEL(id=7, username='buffet', password='buffet1', groups=['order'])
    WARDROBE_PATCHED = MODEL(id=3, username='giftshop', password='giftshop1', groups=['order', 'check_in'])

    @classmethod
    def init(cls):
        for user in cls.ALL:
            if user.username is 'admin':
                continue
            User.objects.create_user(user.username, '', user.password)

    @classmethod
    def post_init(cls):
        for user in cls.ALL:
            groups = [Group.objects.get(name=group_name).id for group_name in user.groups]
            User.objects.get(id=user.id).groups.add(*groups)
