import logging
from decimal import Decimal

from api.models.bonus_transaction import BonusTransaction
from api.models.guest import Guest
from api.tests.data.bonus_transactions import TestBonusTransactions
from api.tests.data.guests import TestGuests
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase
from api.tests.utils.utils import to_iso_format

LOG = logging.getLogger(__name__)


class BonusTransactionViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/bonus_transactions')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestBonusTransactions.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/bonus_transactions'])

    def test_get_by_card(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/bonus_transactions?guest__card={TestGuests.ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestBonusTransactions.BTX1, TestBonusTransactions.BTX3])

    def test_get_by_nocard(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/bonus_transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_post(self):
        self.login(TestUsers.TOPUP)
        identifier = 'POST/bonus_transactions'

        response, server_time = self.time_constrained(
            lambda: self.client.post('/bonus_transactions', self.REQUESTS[identifier])
        )
        self.assertEqual(response.status_code, 201)
        TestBonusTransactions.BTX4.time = server_time
        self.assertValueEqual(
            BonusTransaction.objects.all(),
            TestBonusTransactions.ALL + [TestBonusTransactions.BTX4]
        )
        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch(self):
        self.login(TestUsers.TOPUP)
        identifier = f'PATCH/bonus_transactions/{TestBonusTransactions.BTX3.id}'

        response, server_time = self.time_constrained(
            lambda: self.client.patch(
                f'/bonus_transactions/{TestBonusTransactions.BTX3.id}',
                self.REQUESTS[f'PATCH/bonus_transactions/{TestBonusTransactions.BTX3.id}']
            )
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(BonusTransaction.objects.get(id=TestBonusTransactions.BTX3.id).pending)
        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_post_by_card(self):
        self.login(TestUsers.TOPUP)

        response = self.client.post('/bonus_transactions', self.REQUESTS['POST/bonus_transactions#card'])
        self.assertEqual(response.status_code, 201)

        self.assertValueEqual(
            BonusTransaction.objects.all(), TestBonusTransactions.ALL + [TestBonusTransactions.BTX4],
            ignore_fields=['time']
        )

    def test_post_by_card_fail(self):
        self.login(TestUsers.TOPUP)

        body = {**self.REQUESTS['POST/bonus_transactions#card'], **{'card': '567b'}}
        response = self.client.post('/bonus_transactions', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['card'][0], 'Card not registered.')

    def test_crediting(self):
        self.login(TestUsers.TOPUP)

        roby = Guest.objects.get(pk=TestGuests.ROBY.id)
        roby.balance = '3.00'
        roby.bonus = '5.00'
        roby.save()

        data = {
            'guest': TestGuests.ROBY.id,
            'value': '3.00',
            'description': 'loyalty'
        }
        response = self.client.post('/bonus_transactions', data)
        self.client.patch(f"/bonus_transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('3.00'))
        self.assertEqual(roby.bonus, Decimal('8.00'))

        data['value'] = '-10.00'
        response = self.client.post('/bonus_transactions', data)
        self.client.patch(f"/bonus_transactions/{response.data['id']}", {'pending': False})
        roby.refresh_from_db()
        self.assertEqual(roby.balance, Decimal('3.00'))
        self.assertEqual(roby.bonus, Decimal('-2.00'))

    def test_patch_readonly(self):
        self.login(TestUsers.TOPUP)

        mutable_fields = {
        }

        # Before committing, most fields are immutable.
        immutable_fields = {
            'time': '2019-12-31T22:03:10Z',
            'guest': TestGuests.SHEELAH.id,
            'value': '10.00',
            'description': 'even more staff bonus'
        }

        self.assertPatchReadonly(
            f'/bonus_transactions/{TestBonusTransactions.BTX3.id}',
            mutable_fields,
            immutable_fields
        )

        # Commit transaction.
        response = self.client.patch(f'/bonus_transactions/{TestBonusTransactions.BTX3.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2019-12-31T22:03:10Z',
            'guest': TestGuests.SHEELAH.id,
            'value': '10.00',
            'description': 'even more staff bonus'
        }

        self.assertPatchReadonly(
            f'/bonus_transactions/{TestBonusTransactions.BTX3.id}',
            mutable_fields,
            immutable_fields
        )

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/bonus_transactions'), [TestUsers.ADMIN])
        self.assertPermissions(lambda: self.client.get(f'/bonus_transactions/{TestBonusTransactions.BTX1.id}'), [])
        self.assertPermissions(
            lambda: self.client.get(f'/bonus_transactions?guest__card={TestGuests.ROBY.card}'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/bonus_transactions', self.REQUESTS['POST/bonus_transactions']),
            [TestUsers.ADMIN, TestUsers.TOPUP]
        )
        self.assertPermissions(
            lambda: self.client.delete('/bonus_transactions/1'),
            []
        )

    def test_str(self):
        LOG.debug(TestBonusTransactions.BTX1)
        self.assertEqual(
            str(TestBonusTransactions.BTX1),
            f'BonusTransaction('
            f'id=1,'
            f'time="2019-12-31 22:01:00+00:00",'
            f'value=2.50,'
            f'description="staff bonus",'
            f'guest={str(TestGuests.ROBY)}'
            f')'
        )
