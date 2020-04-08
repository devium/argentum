import logging
from decimal import Decimal

from api.models import Guest
from api.tests.data.bonus_transactions import TestBonusTransactions
from api.tests.data.guests import TestGuests
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class BonusTransactionViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestBonusTransactions]

    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/bonus_transactions', TestBonusTransactions.SAVED)

    def test_list_by_card(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test(
            f'/bonus_transactions?guest__card={TestGuests.ROBY.card}',
            [TestBonusTransactions.BTX1, TestBonusTransactions.BTX3]
        )

    def test_list_by_card_404(self):
        self.login(TestUsers.BAR_EXT)

        response = self.client.get('/bonus_transactions?guest__card=NOTFOUND')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['guest__card'][0], 'Card not registered.')

    def test_list_by_nocard(self):
        self.login(TestUsers.BAR_EXT)

        response = self.client.get(f'/bonus_transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_create_test('/bonus_transactions', TestBonusTransactions, timed=True)

    def test_create_by_card(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_create_test('/bonus_transactions', TestBonusTransactions, '#card', timed=True)

    def test_create_by_card_fail(self):
        self.login(TestUsers.TOPUP_EXT)

        self.perform_create_test(
            '/bonus_transactions',
            TestBonusTransactions,
            '#card404',
            '#card404',
            reference_status=400,
            fail=True
        )

    def test_commit(self):
        self.login(TestUsers.TOPUP_EXT)
        self.perform_update_test('/bonus_transactions', TestBonusTransactions, '#commit', timed=True)

    def test_crediting(self):
        self.login(TestUsers.TOPUP_EXT)

        obj = Guest.objects.get(id=TestGuests.ROBY.id)
        obj.balance = '3.00'
        obj.bonus = '5.00'
        obj.save()

        data = {
            'guest': TestGuests.ROBY.id,
            'value': '3.00',
            'description': 'loyalty'
        }
        response = self.client.post('/bonus_transactions', data)
        self.assertEqual(response.status_code, 201)
        response = self.client.patch(f"/bonus_transactions/{response.data['id']}", {'pending': False})
        self.assertEqual(response.status_code, 200)

        obj.refresh_from_db()
        self.assertEqual(obj.balance, Decimal('3.00'))
        self.assertEqual(obj.bonus, Decimal('8.00'))

        data['value'] = '-10.00'
        response = self.client.post('/bonus_transactions', data)
        self.assertEqual(response.status_code, 201)
        response = self.client.patch(f"/bonus_transactions/{response.data['id']}", {'pending': False})
        self.assertEqual(response.status_code, 200)

        obj.refresh_from_db()
        self.assertEqual(obj.balance, Decimal('3.00'))
        self.assertEqual(obj.bonus, Decimal('-2.00'))

    def test_update_readonly(self):
        self.login(TestUsers.TOPUP_EXT)
        obj = TestBonusTransactions.BTX3

        mutable_fields = {
        }

        # Before committing, most fields are immutable.
        immutable_fields = {
            'time': '2019-12-31T22:03:10Z',
            'value': '10.00',
            'description': 'even more staff bonus'
        }

        self.assertPatchReadonly(f'/bonus_transactions/{obj.id}', mutable_fields, immutable_fields)

        # Commit transaction.
        response = self.client.patch(f'/bonus_transactions/{obj.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2019-12-31T22:03:10Z',
            'value': '10.00',
            'description': 'even more staff bonus'
        }

        self.assertPatchReadonly(f'/bonus_transactions/{obj.id}', mutable_fields, immutable_fields)

    def test_permissions(self):
        self.perform_permission_test(
            '/bonus_transactions',
            list_users=[TestUsers.ADMIN_EXT],
            retrieve_users=[],
            list_by_card_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            create_users=[TestUsers.ADMIN_EXT, TestUsers.TOPUP_EXT],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.TOPUP_EXT],
            delete_users=[],
            card=TestGuests.ROBY.card,
            card_parameter='guest__card',
            detail_id=TestBonusTransactions.BTX1.id,
            update_suffix='#commit'
        )

    def test_str(self):
        obj = TestBonusTransactions.BTX1
        LOG.debug(obj)
        self.assertEqual(
            str(obj),
            f'BonusTransaction('
            f'id={TestBonusTransactions.BTX1.id},'
            f'time="2019-12-31 22:01:00+00:00",'
            f'value=2.50,'
            f'description="default",'
            f'guest={str(TestGuests.ROBY)}'
            f')'
        )
