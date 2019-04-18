from api.models.order_item import OrderItem
from api.tests.data.orders import TestOrders
from api.tests.data.products import TestProducts
from api.tests.utils.test_objects import TestObjects


class TestOrderItems(TestObjects):
    MODEL = OrderItem

    ONE_WATER = MODEL(
        id=1,
        order=TestOrders.ONE_WATER_PLUS_TIP,
        product=TestProducts.WATER,
        quantity_initial=1,
        quantity_current=1
    )

    TWO_COKES = MODEL(
        id=2,
        order=TestOrders.TWO_COKES_PLUS_TIP,
        product=TestProducts.COKE,
        quantity_initial=2,
        quantity_current=2
    )

    ALL = [ONE_WATER, TWO_COKES]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    ONE_WATER2 = MODEL(
        id=3,
        order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
        product=TestProducts.WATER,
        quantity_initial=1,
        quantity_current=1
    )

    ONE_COKE = MODEL(
        id=4,
        order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP,
        product=TestProducts.COKE,
        quantity_initial=1,
        quantity_current=1
    )
