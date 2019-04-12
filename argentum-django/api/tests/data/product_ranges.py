from api.models.product_range import ProductRange
from api.tests.data.products import TestProducts
from api.tests.utils.test_objects import TestObjects


class TestProductRanges(TestObjects):
    MODEL = ProductRange

    JUST_WATER = MODEL(
        id=1,
        name='Just water'
    )

    EVERYTHING = MODEL(
        id=2,
        name='Everything'
    )

    ALL = [JUST_WATER, EVERYTHING]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    JUST_COKE = MODEL(
        id=3,
        name='Just coke'
    )

    @classmethod
    def init(cls):
        super().init()
        for product_range in cls.ALL:
            product_range.create_permission()

    @classmethod
    def post_init(cls):
        cls.JUST_WATER.products.set([TestProducts.WATER])
        cls.EVERYTHING.products.set([TestProducts.WATER, TestProducts.COKE])
