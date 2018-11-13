from decimal import Decimal

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from api.models import Guest
from api.models.bonus_transaction import BonusTransaction
from api.tests.data.bonus_transactions import BTX1, BTX3, BONUS_TRANSACTIONS
from api.tests.data.guests import ROBY, SHEELAH
from api.tests.data.users import TOPUP, ADMIN, TERMINAL, BAR, WARDROBE
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase


class BonusTransactionViewTestCase(
    PopulatedTestCase,
    SerializationTestCase,
    AuthenticatedTestCase
):
    def test_get(self):
        self.login(ADMIN)

        response = self.client.get('/bonus_transactions')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, BONUS_TRANSACTIONS)

    def test_get_by_card(self):
        self.login(BAR)

        response = self.client.get(f'/bonus_transactions?guest__card={ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, [BTX1])

    def test_get_by_nocard(self):
        self.login(BAR)

        response = self.client.get(f'/bonus_transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_get_serialize(self):
        self.login(ADMIN)

        response = self.client.get('/bonus_transactions')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/bonus_transactions'])

    def test_post_deserialize(self):
        self.login(TOPUP)

        BonusTransaction.objects.all().delete()
        start = timezone.now()
        response = self.client.post(
            '/bonus_transactions',
            self.REQUESTS['POST/bonus_transactions']
        )
        end = timezone.now()
        self.assertEqual(response.status_code, 201)

        response_time = parse_datetime(response.data['time'])
        self.assertLess(start, response_time)
        self.assertLess(response_time, end)
        BTX3.time = response_time
        self.assertDeserialization(BonusTransaction.objects.all(), [BTX3])

    def test_crediting(self):
        self.login(TOPUP)

        roby = Guest.objects.get(pk=ROBY.id)
        roby.balance = '3.00'
        roby.bonus = '5.00'
        roby.save()

        data = {
            'guest': ROBY.id,
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
        self.login(TOPUP)

        mutable_fields = {
            'guest': SHEELAH.id,
            'value': '2.50',
            'description': 'loyalty'
        }

        # Before committing, time is readonly.
        immutable_fields = {
            'time': '2019-12-31T22:10:10Z',
        }

        self.assertPatchReadonly(
            f'/bonus_transactions/{BTX1.id}',
            mutable_fields,
            immutable_fields
        )

        # Commit transaction.
        response = self.client.patch(f'/bonus_transactions/{BTX1.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2019-12-31T22:10:10Z',
            'guest': ROBY.id,
            'value': '3.00',
            'description': 'guest bonus'
        }

        self.assertPatchReadonly(
            f'/bonus_transactions/{BTX1.id}',
            mutable_fields,
            immutable_fields
        )

    def test_patch_deserialize(self):
        self.login(TOPUP)

        response = self.client.patch(
            f'/bonus_transactions/{BTX1.id}',
            self.REQUESTS['PATCH/bonus_transactions/1']
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(BonusTransaction.objects.get(id=BTX1.id).pending)

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/bonus_transactions'),
            [ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/bonus_transactions?guest__card={ROBY.card}'),
            [BAR, WARDROBE, TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post(
                '/bonus_transactions',
                self.REQUESTS['POST/bonus_transactions']
            ),
            [ADMIN, TOPUP]
        )
