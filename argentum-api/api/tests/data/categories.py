from api.models.category import Category
from api.tests.utils.test_objects import TestObjects


class TestCategories(TestObjects):
    MODEL = Category

    COAT_CHECK = MODEL(
        id=1,
        name='Coat check',
        color='#ffff00'
    )

    SOFT_DRINKS = MODEL(
        id=2,
        name='Soft drinks',
        color='#00ffff',
    )

    HARD_DRINKS = MODEL(
        id=3,
        name='Hard drinks',
        color='#ff0000',
    )

    ALL = [COAT_CHECK, SOFT_DRINKS, HARD_DRINKS]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    SPIRITS = MODEL(
        id=4,
        name="Spirits",
        color='#ff00ff',
    )

    SOFT_DRINKS_PATCHED = MODEL(
        id=2,
        name='Nonalcoholic',
        color='#00ffff',
    )
