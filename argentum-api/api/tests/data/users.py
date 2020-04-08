from typing import List

from django.contrib.auth.models import User, Group

from api.tests.data.groups import TestGroups
from api.tests.utils.many_to_many_model import ManyToManyModel
from api.tests.utils.many_to_many_test_objects import ManyToManyTestObjects


class TestUsers(ManyToManyTestObjects):
    class UserExt(ManyToManyModel):
        model = User

        def __init__(self, plain_password: str, groups: List[Group], *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.plain_password = plain_password
            self.many_to_many = {'groups': groups}

    MODEL = User
    MODEL_EXT = UserExt

    ADMIN_EXT: MODEL_EXT
    ADMIN: MODEL
    BAR_EXT: MODEL_EXT
    BAR: MODEL
    WARDROBE_EXT: MODEL_EXT
    WARDROBE: MODEL
    RECEPTION_EXT: MODEL_EXT
    RECEPTION: MODEL
    TOPUP_EXT: MODEL_EXT
    TOPUP: MODEL
    TERMINAL_EXT: MODEL_EXT
    TERMINAL: MODEL

    BUFFET_EXT: MODEL_EXT
    BUFFET: MODEL
    WARDROBE_PATCHED_EXT: MODEL_EXT
    WARDROBE_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.ADMIN_EXT = cls.MODEL_EXT(
            id=15010,
            username='admin',
            plain_password='argentum',
            groups=[
                TestGroups.ADMIN,
                TestGroups.ORDER,
                TestGroups.COAT_CHECK,
                TestGroups.CHECK_IN,
                TestGroups.TRANSFER,
                TestGroups.SCAN,
                TestGroups.PRODUCT_RANGE_ALL
            ]
        )
        cls.ADMIN = cls.ADMIN_EXT.obj

        cls.BAR_EXT = cls.MODEL_EXT(
            id=15020,
            username='bar',
            plain_password='bar1',
            groups=[TestGroups.ORDER, TestGroups.PRODUCT_RANGE_1]
        )
        cls.BAR = cls.BAR_EXT.obj

        cls.WARDROBE_EXT = cls.MODEL_EXT(
            id=15030,
            username='wardrobe',
            plain_password='wardrobe1',
            groups=[TestGroups.COAT_CHECK]
        )
        cls.WARDROBE = cls.WARDROBE_EXT.obj

        cls.RECEPTION_EXT = cls.MODEL_EXT(
            id=15040,
            username='reception',
            plain_password='reception1',
            groups=[TestGroups.CHECK_IN]
        )
        cls.RECEPTION = cls.RECEPTION_EXT.obj

        cls.TOPUP_EXT = cls.MODEL_EXT(
            id=15050,
            username='topup',
            plain_password='topup1',
            groups=[TestGroups.TRANSFER]
        )
        cls.TOPUP = cls.TOPUP_EXT.obj

        cls.TERMINAL_EXT = cls.MODEL_EXT(
            id=15060,
            username='terminal',
            plain_password='terminal1',
            groups=[TestGroups.SCAN]
        )
        cls.TERMINAL = cls.TERMINAL_EXT.obj

        cls.SAVED_EXT = [
            cls.ADMIN_EXT,
            cls.BAR_EXT,
            cls.WARDROBE_EXT,
            cls.RECEPTION_EXT,
            cls.TOPUP_EXT,
            cls.TERMINAL_EXT
        ]
        cls.SAVED = [obj_ext.obj for obj_ext in cls.SAVED_EXT]

        cls.BUFFET_EXT = cls.MODEL_EXT(
            id=15070,
            username='buffet',
            plain_password='buffet1',
            groups=[TestGroups.ORDER]
        )
        cls.BUFFET = cls.BUFFET_EXT.obj

        cls.WARDROBE_PATCHED_EXT = cls.MODEL_EXT(
            id=15031,
            username='giftshop',
            plain_password='giftshop1',
            groups=[TestGroups.ORDER, TestGroups.CHECK_IN]
        )
        cls.WARDROBE_PATCHED = cls.WARDROBE_PATCHED_EXT.obj

        cls.UNSAVED_EXT = [cls.BUFFET_EXT, cls.WARDROBE_PATCHED_EXT]
        cls.UNSAVED = [obj_ext.obj for obj_ext in cls.UNSAVED_EXT]

    @classmethod
    def create(cls):
        for user_ext in cls.SAVED_EXT:
            user_ext: cls.UserExt = user_ext
            if user_ext.obj.username == 'admin':
                user_ext.obj.id = User.objects.get(username=user_ext.obj.username).id
            else:
                user_ext.obj.id = User.objects.create_user(user_ext.obj.username, '', user_ext.plain_password).id
            user_ext.obj.refresh_from_db()

        for obj in cls.SAVED_EXT:
            obj.set_many_to_many()
