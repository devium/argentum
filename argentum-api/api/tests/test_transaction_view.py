import logging
from decimal import Decimal

from api.models.guest import Guest
from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase
from api.tests.utils.utils import to_iso_format

LOG = logging.getLogger(__name__)


class TransactionViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/transactions')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestTransactions.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/transactions'])

    def test_get_by_card(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/transactions?guest__card={TestGuests.ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestTransactions.TX1, TestTransactions.TX_ORDER1])
        self.assertJSONEqual(response.content, self.RESPONSES[f'GET/transactions?guest__card={TestGuests.ROBY.card}'])

    def test_get_by_card_not_found(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/transactions?guest__card=NOTFOUND')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['guest__card'][0], 'Card not registered.')

    def test_get_by_nocard(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_post(self):
        self.login(TestUsers.TOPUP)
        identifier = 'POST/transactions'

        response, server_time = self.time_constrained(
            lambda: self.client.post('/transactions', self.REQUESTS[identifier])
        )
        self.assertEqual(response.status_code, 201)

        TestTransactions.TX5.time = server_time
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX5])
        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch(self):
        self.login(TestUsers.TOPUP)
        identifier = f'PATCH/transactions/{TestTransactions.TX4.id}'

        response, server_time = self.time_constrained(
            lambda: self.client.patch(f'/transactions/{TestTransactions.TX4.id}', self.REQUESTS[identifier])
        )
        self.assertEqual(response.status_code, 200)

        self.assertFalse(Transaction.objects.get(id=TestTransactions.TX4.id).pending)
        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_post_by_card(self):
        self.login(TestUsers.TOPUP)

        response = self.client.post('/transactions', self.REQUESTS['POST/transactions#card'])
        self.assertEqual(response.status_code, 201)

        self.assertValueEqual(
            Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX5],
            ignore_fields=['time']
        )

    def test_post_by_card_fail(self):
        self.login(TestUsers.TOPUP)

        body = {**self.REQUESTS['POST/transactions#card'], **{'card': '567b'}}
        response = self.client.post('/transactions', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['card'][0], 'Card not registered.')

    def test_positive_crediting(self):
        self.login(TestUsers.TOPUP)

        roby = Guest.objects.get(pk=TestGuests.ROBY.id)
        roby.balance = '3.00'
        roby.bonus = '5.00'
        roby.save()

        data = {
            'guest': TestGuests.ROBY.id,
            'value': '3.00',
            'ignore_bonus': True,
            'description': 'withdrawal'
        }
        response = self.client.post('/transactions', data)
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('6.00'))
        self.assertEqual(roby.bonus, Decimal('5.00'))

        # Bonus is still ignored because value is deposited.
        data['ignore_bonus'] = False
        response = self.client.post('/transactions', data)
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('9.00'))
        self.assertEqual(roby.bonus, Decimal('5.00'))

    def test_negative_crediting(self):
        self.login(TestUsers.TOPUP)

        roby = Guest.objects.get(pk=TestGuests.ROBY.id)
        roby.balance = '3.00'
        roby.bonus = '5.00'
        roby.save()

        # Transaction ignoring bonus, e.g., a balance withdrawal.
        data = {
            'guest': TestGuests.ROBY.id,
            'value': '-4.00',
            'ignore_bonus': True,
            'description': 'withdrawal'
        }
        response = self.client.post('/transactions', data)
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('-1.00'))
        self.assertEqual(roby.bonus, Decimal('5.00'))

        # Bonus can cover the complete value.
        data['ignore_bonus'] = False
        response = self.client.post('/transactions', data)
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('-1.00'))
        self.assertEqual(roby.bonus, Decimal('1.00'))

        # Bonus can exactly cover the complete value.
        data['value'] = '-1.00'
        response = self.client.post('/transactions', data)
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('-1.00'))
        self.assertEqual(roby.bonus, Decimal('0.00'))

        roby.bonus = '7.00'
        roby.save()

        # Bonus is exceed, remainder covered by balance.
        data['value'] = '-8.00'
        response = self.client.post('/transactions', data)
        self.client.patch(f'/transactions/{response.data["id"]}', {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('-2.00'))
        self.assertEqual(roby.bonus, Decimal('0.00'))

    def test_patch_readonly(self):
        self.login(TestUsers.TOPUP)

        mutable_fields = {
        }

        # Before committing, most fields should be immutable.
        immutable_fields = {
            'time': '2019-12-31T22:30:10Z',
            'value': '-10.00',
            'ignore_bonus': True,
            'description': 'withdraw more'
        }

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX4.id}', mutable_fields, immutable_fields)

        # Commit transaction.
        response = self.client.patch(f'/transactions/{TestTransactions.TX4.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2019-12-31T22:30:10Z',
            'value': '-10.00',
            'ignore_bonus': True,
            'description': 'withdraw more',
            'pending': True
        }

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX4.id}', mutable_fields, immutable_fields)

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/transactions'), [TestUsers.ADMIN])
        self.assertPermissions(
            lambda: self.client.get(f'/transactions?guest__card={TestGuests.ROBY.card}'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(lambda: self.client.get(f'/bonus_transactions/{TestTransactions.TX1.id}'), [])
        self.assertPermissions(
            lambda: self.client.post('/transactions', self.REQUESTS['POST/transactions']),
            [TestUsers.ADMIN, TestUsers.TOPUP]
        )
        self.assertPermissions(
            lambda: self.client.delete('/transactions/1'),
            []
        )

    def test_str(self):
        LOG.debug(TestTransactions.TX_ORDER1)
        self.assertEqual(
            str(TestTransactions.TX_ORDER1),
            f'Transaction('
            f'id=3,'
            f'time="2019-12-31 22:10:00+00:00",'
            f'value=-3.00,'
            f'description="order",'
            f'order={TestOrders.ONE_WATER_PLUS_TIP},'
            f'guest={str(TestGuests.ROBY)}'
            f')'
        )
