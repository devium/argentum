import logging
from decimal import Decimal

from api.models import Guest
from api.models.config import Config
from api.models.order import Order
from api.models.transaction import Transaction
from api.tests.data.discounts import TestDiscounts
from api.tests.data.guests import TestGuests
from api.tests.data.order_items import TestOrderItems
from api.tests.data.orders import TestOrders
from api.tests.data.products import TestProducts
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class OrderViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestOrders, TestOrderItems, TestGuests]

    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/orders', TestOrders.SAVED)

    def test_list_by_card(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test(
            f'/orders?guest__card={TestGuests.ROBY.card}',
            [
                TestOrders.TAG_REGISTRATION_TWO,
                TestOrders.ONE_WATER_PLUS_TIP,
                TestOrders.TAG_REGISTRATION_FOUR,
                TestOrders.TAG_REGISTRATION_FIVE,
            ]
        )

    def test_list_by_card_404(self):
        self.login(TestUsers.BAR_EXT)

        response = self.client.get('/orders?guest__card=404')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['guest__card'][0], 'Card not registered.')

    def test_create(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_create_test(
            '/orders',
            TestOrders,
            side_effects_objects=[TestOrderItems],
            timed=True
        )

    def test_create_by_card(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_create_test(
            '/orders',
            TestOrders,
            '#card',
            side_effects_objects=[TestOrderItems],
            timed=True
        )

    def test_create_by_card_fail(self):
        self.login(TestUsers.BAR_EXT)

        response = self.perform_create_test(
            '/orders',
            TestOrders,
            '#card404',
            '#card404',
            reference_status=400,
            fail=True
        )
        self.assertEqual(response.data['card'][0], 'Card not registered.')

    def test_commit(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_update_test('/orders', TestOrders, '#commit', side_effects_objects=[TestTransactions], timed=True)

        obj = Guest.objects.get(id=TestGuests.SHEELAH.id)
        self.assertEqual(obj.bonus, Decimal('0.00'))
        self.assertEqual(obj.balance, Decimal('1.00'))

    def test_commit_multi(self):
        self.login(TestUsers.BAR_EXT)

        for i in range(3):
            response = self.client.patch(
                f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}',
                self.REQUESTS['PATCH/orders/#commit']
            )
            self.assertEqual(response.status_code, 200)

        self.assertEqual(Transaction.objects.count(), len(TestTransactions.SAVED) + 1)

        obj = Guest.objects.get(id=TestGuests.SHEELAH.id)
        self.assertEqual(obj.bonus, Decimal('0.00'))
        self.assertEqual(obj.balance, Decimal('1.00'))

    def test_discount(self):
        self.login(TestUsers.BAR_EXT)
        self.assertGreater(TestDiscounts.PAID_SOFT_DRINKS.rate, Decimal('0.00'))

        self.perform_create_test('/orders', TestOrders, side_effects_objects=[TestOrderItems], timed=True)
        TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP_COMMITTED.id = TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP.id
        self.perform_update_test('/orders', TestOrders, '#discount', timed=True)

        transaction = Transaction.objects.get(order=TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP)
        self.assertEqual(
            (-transaction.value).compare(
                TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP.custom_current +
                TestProducts.WATER.price * (1 - TestDiscounts.PAID_SOFT_DRINKS.rate) + TestProducts.COKE.price
            ), 0
        )

    def test_funds(self):
        self.login(TestUsers.BAR_EXT)

        postpaid_limit = Config.objects.get(key='postpaid_limit')
        order = Order.objects.get(id=TestOrders.TWO_COKES_PLUS_TIP.id)

        postpaid_limit.value = Decimal('-20.00')
        postpaid_limit.save()
        remaining = TestGuests.SHEELAH.bonus + TestGuests.SHEELAH.balance - order.total
        order.custom_initial = order.custom_current + remaining - postpaid_limit.value + Decimal('0.01')
        order.custom_current = order.custom_initial
        order.save()

        response = self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'Insufficient funds.')

        order.custom_current = order.custom_initial = order.custom_current - Decimal('0.01')
        order.save()

        response = self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

    def test_cancel_custom(self):
        self.login(TestUsers.BAR_EXT)

        # Cannot cancel more than initial custom value.
        response = self.client.patch(
            f'/orders/{TestOrders.ONE_WATER_PLUS_TIP.id}',
            self.REQUESTS['PATCH/orders/#cancel_exceed']
        )
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['custom_current'][0])

        # Cannot cancel a negative amount.
        response = self.client.patch(
            f'/orders/{TestOrders.ONE_WATER_PLUS_TIP.id}',
            self.REQUESTS['PATCH/orders/#cancel_negative']
        )
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['custom_current'][0])

        # Valid cancellation.
        self.perform_update_test(
            '/orders',
            TestOrders,
            '#cancel',
            side_effects_objects=[TestTransactions],
            side_effects_objects_filter=dict(
                order=TestOrders.ONE_WATER_PLUS_TIP,
                description='cancel',
                value=(
                        TestOrders.ONE_WATER_PLUS_TIP_CANCELLED.custom_initial -
                        TestOrders.ONE_WATER_PLUS_TIP_CANCELLED.custom_current
                )
            )
        )

    def test_cancel_product(self):
        self.login(TestUsers.ADMIN_EXT)

        # Cannot cancel more than initial quantity.
        response = self.client.patch(
            f'/order_items/{TestOrderItems.ONE_WATER.id}',
            self.REQUESTS['PATCH/order_items/#cancel_exceed']
        )
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['quantity_current'][0])

        # Cannot cancel a negative quantity.
        response = self.client.patch(
            f'/order_items/{TestOrderItems.ONE_WATER.id}',
            self.REQUESTS['PATCH/order_items/#cancel_negative']
        )
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['quantity_current'][0])

        # Valid cancellation.
        total_initial = TestOrders.ONE_WATER_PLUS_TIP.total
        self.perform_update_test(
            '/order_items',
            TestOrderItems,
            '#cancel',
            side_effects_objects=[TestTransactions],
            side_effects_objects_filter=dict(
                order=TestOrders.ONE_WATER_PLUS_TIP,
                description='cancel',
                value=TestProducts.WATER.price
            )
        )

        obj = Order.objects.get(id=TestOrders.ONE_WATER_PLUS_TIP.id)
        self.assertEqual(total_initial - TestProducts.WATER.price, obj.total)

    def test_permissions(self):
        self.perform_permission_test(
            '/orders',
            list_users=[TestUsers.ADMIN_EXT],
            list_by_card_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT],
            delete_users=[],
            card=TestGuests.ROBY.card,
            card_parameter='guest__card',
            detail_id=TestOrders.ONE_WATER_PLUS_TIP.id,
            update_suffix='#commit'
        )
        self.perform_permission_test(
            '/order_items',
            list_users=[],
            retrieve_users=[],
            create_users=[],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT],
            delete_users=[],
            list_404=True,
            detail_id=TestOrderItems.ONE_WATER.id,
            update_suffix='#cancel'
        )

    def test_str(self):
        LOG.debug(TestOrders.ONE_WATER_PLUS_TIP)
        self.assertEqual(
            str(TestOrders.ONE_WATER_PLUS_TIP),
            f'Order('
            f'id={TestOrders.ONE_WATER_PLUS_TIP.id},'
            f'time="2019-12-31 22:10:00+00:00",'
            f'custom_initial=0.20,'
            f'custom_current=0.20,'
            f'guest={TestGuests.ROBY},'
            f'items=[{TestOrderItems.ONE_WATER}],'
            f'pending=False'
            f')'
        )
