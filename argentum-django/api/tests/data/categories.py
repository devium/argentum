from api.models.category import Category

SOFT_DRINKS = Category(
    id=1,
    name='Soft drinks',
    color='#00ffff'
)

HARD_DRINKS = Category(
    id=2,
    name='Hard drinks',
    color='#ff0000'
)

CATEGORIES = [SOFT_DRINKS, HARD_DRINKS]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

SPIRITS = Category(
    id=3,
    name="Spirits",
    color='#ff00ff',
)
