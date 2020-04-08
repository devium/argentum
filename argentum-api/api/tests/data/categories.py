from api.models.category import Category
from api.tests.utils.test_objects import TestObjects


class TestCategories(TestObjects):
    MODEL = Category

    COAT_CHECK: MODEL
    SOFT_DRINKS: MODEL
    HARD_DRINKS: MODEL

    SPIRITS: MODEL
    SOFT_DRINKS_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.COAT_CHECK = cls.MODEL(
            id=11010,
            name='Coat check',
            color='#ffff00'
        )

        cls.SOFT_DRINKS = cls.MODEL(
            id=11020,
            name='Soft drinks',
            color='#00ffff',
        )

        cls.HARD_DRINKS = cls.MODEL(
            id=11030,
            name='Hard drinks',
            color='#ff0000',
        )

        cls.SAVED = [cls.COAT_CHECK, cls.SOFT_DRINKS, cls.HARD_DRINKS]

        cls.SPIRITS = cls.MODEL(
            id=11040,
            name="Spirits",
            color='#ff00ff',
        )

        cls.SOFT_DRINKS_PATCHED = cls.MODEL(
            id=11021,
            name='Nonalcoholic',
            color='#00ffff',
        )

        cls.UNSAVED = [cls.SPIRITS, cls.SOFT_DRINKS_PATCHED]
