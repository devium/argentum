import logging
from decimal import Decimal

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from api.models.guest import Guest
from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class TransactionViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/transactions')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestTransactions.ALL)

    def test_get_by_card(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/transactions?guest__card={TestGuests.ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestTransactions.TX1])

    def test_get_by_nocard(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_get_serialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/transactions')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/transactions'])

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
        self.client.patch(f"/transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('-2.00'))
        self.assertEqual(roby.bonus, Decimal('0.00'))

    def test_patch_readonly(self):
        self.login(TestUsers.TOPUP)

        mutable_fields = {
            'guest': TestGuests.SHEELAH.id,
            'value': '2.50',
            'description': 'topup',
            'ignore_bonus': False
        }

        # Before committing, time is readonly.
        immutable_fields = {
            'time': '2019-12-31T22:10:10Z',
        }

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX1.id}', mutable_fields, immutable_fields)

        # Commit transaction.
        response = self.client.patch(f'/transactions/{TestTransactions.TX1.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2019-12-31T22:10:10Z',
            'guest': TestGuests.ROBY.id,
            'value': '3.00',
            'ignore_bonus': True,
            'description': 'initial'
        }

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX1.id}', mutable_fields, immutable_fields)

    def test_post_deserialize(self):
        self.login(TestUsers.TOPUP)

        start = timezone.now()
        response = self.client.post('/transactions', self.REQUESTS['POST/transactions'])
        end = timezone.now()
        self.assertEqual(response.status_code, 201)

        response_time = parse_datetime(response.data['time'])
        self.assertLess(start, response_time)
        self.assertLess(response_time, end)
        TestTransactions.TX3.time = response_time
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.ALL + [TestTransactions.TX3])

    def test_patch_deserialize(self):
        # Since this field is read-only on creation, this requires a separate test.
        self.login(TestUsers.TOPUP)

        response = self.client.patch(
            f'/transactions/{TestTransactions.TX1.id}',
            self.REQUESTS['PATCH/transactions/1']
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Transaction.objects.get(id=TestTransactions.TX1.id).pending)

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/transactions'),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/transactions?guest__card={TestGuests.ROBY.card}'),
            [TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/transactions', self.REQUESTS['POST/transactions']),
            [TestUsers.ADMIN, TestUsers.TOPUP]
        )
        self.assertPermissions(
            lambda: self.client.delete('/transactions/1'),
            []
        )

    def test_str(self):
        LOG.debug(TestTransactions.TX1)
        self.assertEqual(
            str(TestTransactions.TX1),
            f'Transaction('
            f'id=1,time="2019-12-31 22:05:00+00:00",value=3.00,description="initial",guest={str(TestGuests.ROBY)}'
            f')'
        )
