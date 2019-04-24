from api.models.category import Category
from api.tests.utils.test_objects import TestObjects


class TestCategories(TestObjects):
    MODEL = Category

    SOFT_DRINKS = MODEL(
        id=1,
        name='Soft drinks',
        color='#00ffff',
    )

    HARD_DRINKS = MODEL(
        id=2,
        name='Hard drinks',
        color='#ff0000',
    )

    ALL = [SOFT_DRINKS, HARD_DRINKS]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    SPIRITS = MODEL(
        id=3,
        name="Spirits",
        color='#ff00ff',
    )

    SOFT_DRINKS_PATCHED = MODEL(
        id=1,
        name='Nonalcoholic',
        color='#00ffff',
    )
