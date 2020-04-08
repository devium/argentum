from decimal import Decimal

from api.models.order_item import OrderItem
from api.tests.data.orders import TestOrders
from api.tests.data.products import TestProducts
from api.tests.utils.test_objects import TestObjects


class TestOrderItems(TestObjects):
    MODEL = OrderItem
    
    ONE_COAT_CHECK_ITEM_1: MODEL
    ONE_COAT_CHECK_ITEM_2: MODEL
    ONE_WATER: MODEL
    TWO_COKES: MODEL
    ONE_COAT_CHECK_ITEM_3: MODEL
    ONE_COAT_CHECK_ITEM_4: MODEL

    ONE_WATER_CANCELLED: MODEL
    ONE_WATER2: MODEL
    ONE_COKE: MODEL

    @classmethod
    def init(cls):
        cls.ONE_COAT_CHECK_ITEM_1 = cls.MODEL(
            id=19010,
            order=TestOrders.TAG_REGISTRATION_TWO,
            product=TestProducts.COAT_CHECK_ITEM,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.ONE_COAT_CHECK_ITEM_2 = cls.MODEL(
            id=19020,
            order=TestOrders.TAG_REGISTRATION_THREE,
            product=TestProducts.COAT_CHECK_ITEM,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.ONE_WATER = cls.MODEL(
            id=19030,
            order=TestOrders.ONE_WATER_PLUS_TIP,
            product=TestProducts.WATER,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.TWO_COKES = cls.MODEL(
            id=19040,
            order=TestOrders.TWO_COKES_PLUS_TIP,
            product=TestProducts.COKE,
            quantity_initial=2,
            quantity_current=2,
            discount=Decimal('0.00')
        )

        cls.ONE_COAT_CHECK_ITEM_3 = cls.MODEL(
            id=19050,
            order=TestOrders.TAG_REGISTRATION_FOUR,
            product=TestProducts.COAT_CHECK_ITEM,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.ONE_COAT_CHECK_ITEM_4 = cls.MODEL(
            id=19060,
            order=TestOrders.TAG_REGISTRATION_FIVE,
            product=TestProducts.COAT_CHECK_ITEM,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.SAVED = [
            cls.ONE_COAT_CHECK_ITEM_1,
            cls.ONE_COAT_CHECK_ITEM_2,
            cls.ONE_WATER,
            cls.TWO_COKES,
            cls.ONE_COAT_CHECK_ITEM_3,
            cls.ONE_COAT_CHECK_ITEM_4
        ]

        cls.ONE_WATER_CANCELLED = cls.MODEL(
            id=19031,
            order=TestOrders.ONE_WATER_PLUS_TIP,
            product=TestProducts.WATER,
            quantity_initial=1,
            quantity_current=0,
            discount=Decimal('0.00')
        )

        cls.ONE_WATER2 = cls.MODEL(
            id=19070,
            order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
            product=TestProducts.WATER,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.10')
        )

        cls.ONE_COKE = cls.MODEL(
            id=19080,
            order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
            product=TestProducts.COKE,
            quantity_initial=1,
            quantity_current=1,
            discount=Decimal('0.00')
        )

        cls.UNSAVED = [cls.ONE_WATER_CANCELLED, cls.ONE_WATER2, cls.ONE_COKE]
