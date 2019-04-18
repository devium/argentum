import logging
from decimal import Decimal

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from api.models.config import Config
from api.models.order import Order
from api.models.order_item import OrderItem
from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.order_items import TestOrderItems
from api.tests.data.orders import TestOrders
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class OrderViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/orders')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestOrders.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/orders')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/orders'])

    def test_post_deserialize(self):
        self.login(TestUsers.BAR)

        start = timezone.now()
        response = self.client.post('/orders', self.REQUESTS['POST/orders'])
        end = timezone.now()
        self.assertEqual(response.status_code, 201)

        server_time = parse_datetime(response.data['time'])
        self.assertLess(start, server_time)
        self.assertLess(server_time, end)
        TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP.time = server_time

        self.assertValueEqual(Order.objects.all(), TestOrders.ALL + [TestOrders.ONE_WATER_ONE_COKE_PLUS_TIP])
        self.assertValueEqual(
            OrderItem.objects.all(),
            TestOrderItems.ALL + [TestOrderItems.ONE_WATER2, TestOrderItems.ONE_COKE]
        )

    def test_post_by_card(self):
        self.login(TestUsers.BAR)

        response = self.client.post('/orders', self.REQUESTS['POST/orders#card'])
        self.assertEqual(response.status_code, 201)

        self.assertValueEqual(
            Order.objects.all(), TestOrders.ALL + [TestOrders.ONE_WATER_PLUS_TIP],
            ignore_fields=['time']
        )

    def test_post_by_card_fail(self):
        self.login(TestUsers.BAR)

        body = {**self.REQUESTS['POST/orders#card'], **{'card': '567b'}}
        response = self.client.post('/orders', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['card'][0], 'Card not registered.')

    def test_commit(self):
        self.login(TestUsers.BAR)

        start = timezone.now()
        response = self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False})
        end = timezone.now()
        self.assertEqual(response.status_code, 200)

        server_time = parse_datetime(response.data['time'])
        self.assertLess(start, server_time)
        self.assertLess(server_time, end)
        TestTransactions.TX_ORDER2.time = server_time

        TestGuests.SHEELAH.refresh_from_db()
        self.assertEqual(TestGuests.SHEELAH.bonus, Decimal('0.00'))
        self.assertEqual(TestGuests.SHEELAH.balance, Decimal('2.00'))
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX_ORDER2])

    def test_funds(self):
        self.login(TestUsers.BAR)

        postpaid_limit = Config.objects.get(key='postpaid_limit')
        order = Order.objects.get(id=TestOrders.TWO_COKES_PLUS_TIP.id)

        postpaid_limit.value = Decimal('-20.00')
        postpaid_limit.save()
        order.custom_current = order.custom_initial = Decimal('22.61')
        order.save()

        response = self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'Insufficient funds.')

        order.custom_current = order.custom_initial = Decimal('22.60')
        order.save()

        response = self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

    def test_cancel_custom(self):
        self.login(TestUsers.BAR)

        response = self.client.patch(f'/orders/{TestOrders.ONE_WATER_PLUS_TIP.id}', {'custom_current': 0.20})
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['custom_current'][0])

        response = self.client.patch(f'/orders/{TestOrders.ONE_WATER_PLUS_TIP.id}', {'custom_current': -0.10})
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['custom_current'][0])

        start = timezone.now()
        response = self.client.patch(f'/orders/{TestOrders.ONE_WATER_PLUS_TIP.id}', {'custom_current': 0.05})
        end = timezone.now()
        self.assertEqual(response.status_code, 200)

        transaction_time = Transaction.objects.get(id=TestTransactions.TX_CANCEL1.id).time
        self.assertLess(start, transaction_time)
        self.assertLess(transaction_time, end)
        TestTransactions.TX_CANCEL1.time = transaction_time
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX_CANCEL1])

    def test_cancel_product(self):
        self.login(TestUsers.ADMIN)

        response = self.client.patch(f'/order_items/{TestOrderItems.ONE_WATER.id}', {'quantity_current': -1})
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['quantity_current'][0])

        response = self.client.patch(f'/order_items/{TestOrderItems.ONE_WATER.id}', {'quantity_current': 1})
        self.assertEqual(response.status_code, 400)
        self.assertIsNotNone(response.data['quantity_current'][0])

        start = timezone.now()
        response = self.client.patch(f'/order_items/{TestOrderItems.ONE_WATER.id}', {'quantity_current': 0})
        end = timezone.now()
        self.assertEqual(response.status_code, 200)

        transaction_time = Transaction.objects.get(id=TestTransactions.TX_CANCEL2.id).time
        self.assertLess(start, transaction_time)
        self.assertLess(transaction_time, end)
        TestTransactions.TX_CANCEL2.time = transaction_time
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX_CANCEL2])

    def test_get_by_card(self):
        self.login(TestUsers.TERMINAL)

        response = self.client.get(f'/orders?guest__card={TestGuests.ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestOrders.ONE_WATER_PLUS_TIP])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/orders'),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/orders?guest__card={TestGuests.ROBY.card}'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/orders', self.REQUESTS['POST/orders']),
            [TestUsers.ADMIN, TestUsers.BAR]
        )
        self.assertPermissions(
            lambda: self.client.patch(f'/orders/{TestOrders.TWO_COKES_PLUS_TIP.id}', {'pending': False}),
            [TestUsers.ADMIN, TestUsers.BAR]
        )
        self.assertPermissions(lambda: self.client.get('/order_items', {}), [], [404])
        self.assertPermissions(lambda: self.client.post('/order_items', {}), [], [404])
        self.assertPermissions(lambda: self.client.get(f'/order_items/{TestOrderItems.ONE_WATER.id}', {}), [])
        self.assertPermissions(
            lambda: self.client.patch(f'/order_items/{TestOrderItems.ONE_WATER.id}', {}),
            [TestUsers.ADMIN, TestUsers.BAR]
        )

    def test_str(self):
        LOG.debug(TestOrders.ONE_WATER_PLUS_TIP)
        self.assertEqual(
            str(TestOrders.ONE_WATER_PLUS_TIP),
            f'Order('
            f'id=1,'
            f'time="2019-12-31 22:10:00+00:00",'
            f'custom_initial=0.20,'
            f'custom_current=0.20,'
            f'guest={TestGuests.ROBY},'
            f'items=[{TestOrderItems.ONE_WATER}]'
            f')'
        )
