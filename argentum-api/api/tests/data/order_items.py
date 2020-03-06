from decimal import Decimal

from api.models.order_item import OrderItem
from api.tests.data.orders import TestOrders
from api.tests.data.products import TestProducts
from api.tests.utils.test_objects import TestObjects


class TestOrderItems(TestObjects):
    MODEL = OrderItem
    
    ONE_COAT_CHECK_ITEM_1 = MODEL(
        id=1,
        order=TestOrders.TAG_REGISTRATION_TWO,
        product=TestProducts.COAT_CHECK_ITEM,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )

    ONE_COAT_CHECK_ITEM_2 = MODEL(
        id=2,
        order=TestOrders.TAG_REGISTRATION_THREE,
        product=TestProducts.COAT_CHECK_ITEM,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )

    ONE_WATER = MODEL(
        id=3,
        order=TestOrders.ONE_WATER_PLUS_TIP,
        product=TestProducts.WATER,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )

    TWO_COKES = MODEL(
        id=4,
        order=TestOrders.TWO_COKES_PLUS_TIP,
        product=TestProducts.COKE,
        quantity_initial=2,
        quantity_current=2,
        discount=Decimal('0.00')
    )

    ONE_COAT_CHECK_ITEM_3 = MODEL(
        id=5,
        order=TestOrders.TAG_REGISTRATION_FOUR,
        product=TestProducts.COAT_CHECK_ITEM,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )

    ONE_COAT_CHECK_ITEM_4 = MODEL(
        id=6,
        order=TestOrders.TAG_REGISTRATION_FIVE,
        product=TestProducts.COAT_CHECK_ITEM,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )

    ALL = [
        ONE_COAT_CHECK_ITEM_1,
        ONE_COAT_CHECK_ITEM_2,
        ONE_WATER,
        TWO_COKES,
        ONE_COAT_CHECK_ITEM_3,
        ONE_COAT_CHECK_ITEM_4
    ]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    ONE_WATER2 = MODEL(
        id=7,
        order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
        product=TestProducts.WATER,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.10')
    )

    ONE_COKE = MODEL(
        id=8,
        order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
        product=TestProducts.COKE,
        quantity_initial=1,
        quantity_current=1,
        discount=Decimal('0.00')
    )
