import logging
from decimal import Decimal

from api.models.guest import Guest
from api.models.transaction import Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class TransactionViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestTransactions]

    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/transactions', TestTransactions.SAVED)

    def test_list_by_card(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test(
            f'/transactions?guest__card={TestGuests.ROBY.card}',
            [
                TestTransactions.TX1,
                TestTransactions.TX_COAT_CHECK_1,
                TestTransactions.TX_ORDER_1
            ]
        )

    def test_get_by_card_not_found(self):
        self.login(TestUsers.BAR_EXT)

        response = self.client.get('/transactions?guest__card=404')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['guest__card'][0], 'Card not registered.')

    def test_get_by_nocard(self):
        self.login(TestUsers.BAR_EXT)

        response = self.client.get(f'/transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_create_test('/transactions', TestTransactions, timed=True)

    def test_create_by_card(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_create_test('/transactions', TestTransactions, '#card', timed=True)

    def test_post_by_card_fail(self):
        self.login(TestUsers.TOPUP_EXT)

        body = {**self.REQUESTS['POST/transactions#card'], **{'card': '567b'}}
        response = self.client.post('/transactions', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['card'][0], 'Card not registered.')

    def test_commit(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_update_test('/transactions', TestTransactions, '#commit', timed=True)

    def test_positive_crediting(self):
        self.login(TestUsers.TOPUP_EXT)

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
        self.login(TestUsers.TOPUP_EXT)

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
        self.login(TestUsers.TOPUP_EXT)

        mutable_fields = {
        }

        # Before committing, most fields should be immutable.
        immutable_fields = {
            'time': '2019-12-31T22:30:10Z',
            'value': '-10.00',
            'ignore_bonus': True,
            'description': 'withdraw more'
        }

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX3.id}', mutable_fields, immutable_fields)

        # Commit transaction.
        response = self.client.patch(f'/transactions/{TestTransactions.TX3.id}', {'pending': False})
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

        self.assertPatchReadonly(f'/transactions/{TestTransactions.TX3.id}', mutable_fields, immutable_fields)

    def test_permissions(self):
        self.perform_permission_test(
            '/transactions',
            list_users=[TestUsers.ADMIN_EXT],
            list_by_card_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT, TestUsers.TOPUP_EXT],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.TOPUP_EXT],
            delete_users=[],
            detail_id=TestTransactions.TX1.id,
            card=TestGuests.ROBY.card,
            card_parameter='guest__card',
            update_suffix='#commit'
        )

    def test_str(self):
        LOG.debug(TestTransactions.TX_ORDER_1)
        self.assertEqual(
            str(TestTransactions.TX_ORDER_1),
            f'Transaction('
            f'id={TestTransactions.TX_ORDER_1.id},'
            f'time="2019-12-31 22:10:00+00:00",'
            f'value=-3.00,'
            f'description="order",'
            f'order={TestOrders.ONE_WATER_PLUS_TIP},'
            f'guest={str(TestGuests.ROBY)}'
            f')'
        )
