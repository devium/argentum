from typing import List

from api.models import Product
from api.models.product_range import ProductRange
from api.tests.data.products import TestProducts
from api.tests.utils.many_to_many_model import ManyToManyModel
from api.tests.utils.many_to_many_test_objects import ManyToManyTestObjects


class TestProductRanges(ManyToManyTestObjects):
    class ProductRangeExt(ManyToManyModel):
        model = ProductRange

        def __init__(self, products: List[Product], *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.many_to_many = {'products': products}

    MODEL = ProductRange
    MODEL_EXT = ProductRangeExt

    JUST_WATER_EXT: MODEL_EXT
    JUST_WATER: MODEL
    EVERYTHING_EXT: MODEL_EXT
    EVERYTHING: MODEL

    JUST_COKE_EXT: MODEL_EXT
    JUST_COKE: MODEL
    JUST_WATER_PATCHED_EXT: MODEL_EXT
    JUST_WATER_PATCHED: MODEL

    @classmethod
    def init(cls):
        cls.JUST_WATER_EXT = cls.MODEL_EXT(
            id=13010,
            name='Just water',
            products=[TestProducts.WATER]
        )
        cls.JUST_WATER = cls.JUST_WATER_EXT.obj

        cls.EVERYTHING_EXT = cls.MODEL_EXT(
            id=13020,
            name='Everything',
            products=[TestProducts.WATER, TestProducts.COKE]
        )
        cls.EVERYTHING = cls.EVERYTHING_EXT.obj

        cls.SAVED_EXT = [cls.JUST_WATER_EXT, cls.EVERYTHING_EXT]
        cls.SAVED = [obj_ext.obj for obj_ext in cls.SAVED_EXT]

        cls.JUST_COKE_EXT = cls.MODEL_EXT(
            id=13030,
            name='Just coke',
            products=[TestProducts.COKE]
        )
        cls.JUST_COKE = cls.JUST_COKE_EXT.obj

        cls.JUST_WATER_PATCHED_EXT = cls.MODEL_EXT(
            id=13011,
            name='Just aqua',
            products=[TestProducts.WATER]
        )
        cls.JUST_WATER_PATCHED = cls.JUST_WATER_PATCHED_EXT.obj

        cls.UNSAVED_EXT = [cls.JUST_COKE_EXT, cls.JUST_WATER_PATCHED_EXT]
        cls.UNSAVED = [obj_ext.obj for obj_ext in cls.UNSAVED_EXT]

    @classmethod
    def create(cls):
        super().create()
        for product_range in cls.SAVED:
            product_range: ProductRange = product_range
            product_range.create_permission()
