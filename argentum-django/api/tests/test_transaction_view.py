from django.utils import timezone
from django.utils.dateparse import parse_datetime

from api.models import Transaction
from api.tests.data.guests import ROBY, SHEELAH
from api.tests.data.transactions import TRANSACTIONS, TX2, TX3, TX1
from api.tests.data.users import TOPUP, ADMIN, TERMINAL, BAR, WARDROBE
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase


class TransactionViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(ADMIN)

        response = self.client.get('/transactions')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, TRANSACTIONS)

    def test_get_by_card(self):
        self.login(BAR)

        response = self.client.get(f'/transactions?guest__card={ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, [TX1])

    def test_get_by_nocard(self):
        self.login(BAR)

        response = self.client.get(f'/transactions?guest__card=')
        self.assertEqual(response.status_code, 403)

    def test_get_serialize(self):
        self.login(ADMIN)

        response = self.client.get('/transactions')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/transactions'])

    def test_post_deserialize(self):
        self.login(TOPUP)

        Transaction.objects.all().delete()
        start = timezone.now()
        response = self.client.post('/transactions', self.REQUESTS['POST/transactions'])
        end = timezone.now()
        self.assertEqual(response.status_code, 201)

        response_time = parse_datetime(response.data['time'])
        self.assertLess(start, response_time)
        self.assertLess(response_time, end)
        TX3.time = response_time
        self.assertDeserialization(Transaction.objects.all(), [TX3])

    def test_patch_readonly(self):
        self.login(TOPUP)

        mutable_fields = {
            'guest': SHEELAH.id,
            'value': '2.50',
            'description': 'topup'
        }

        # Before committing, time is readonly.
        immutable_fields = {
            'time': '2018-12-31T22:10:10Z',
        }

        self.assertPatchReadonly(f'/transactions/{TX1.id}', mutable_fields, immutable_fields)

        # Commit transaction.
        response = self.client.patch(f'/transactions/{TX1.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        # After committing, everything should be immutable.
        mutable_fields = {}
        immutable_fields = {
            'time': '2018-12-31T22:10:10Z',
            'guest': ROBY.id,
            'value': '3.00',
            'description': 'initial'
        }

        self.assertPatchReadonly(f'/transactions/{TX1.id}', mutable_fields, immutable_fields)

    def test_patch_deserialize(self):
        self.login(TOPUP)

        response = self.client.patch(
            f'/transactions/{TX1.id}',
            self.REQUESTS['PATCH/transactions/1']
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Transaction.objects.get(id=TX1.id).pending)

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/transactions'),
            [ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.get('/transactions?guest__card={JIMMY.card}'),
            [BAR, WARDROBE, TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/transactions', self.REQUESTS['POST/transactions']),
            [ADMIN, TOPUP]
        )