from django.utils import timezone
from django.utils.dateparse import parse_datetime

from api.models import Transaction
from api.tests.data.guests import JIMMY, NORBERT
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

        response = self.client.get(f"/transactions?guest__card={JIMMY.card}")
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, [TX2])

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

        mutable_data1 = {
            'guest': JIMMY.id,
            'value': '2.50',
            'description': 'topup'
        }

        # Before committing, time is readonly.
        immutable_data1 = {
            'time': '2018-12-31T22:10:10Z',
        }

        # After committing, everything should be immutable.
        immutable_data2 = {
            'time': '2018-12-31T22:10:10Z',
            'guest': NORBERT.id,
            'value': '3.00',
            'description': 'initial'
        }

        response = self.client.patch(
            f'/transactions/{TX1.id}',
            {**mutable_data1, **immutable_data1}
        )
        self.assertEqual(response.status_code, 200)
        for field, value in mutable_data1.items():
            # Mutable values should be adopted.
            self.assertEqual(response.data[field], value, {field: value})
        for field, value in immutable_data1.items():
            # Immutable values should have been rejected.
            self.assertNotEqual(response.data[field], value, {field: value})

        # Commit transaction. Everything should be readonly now.
        response = self.client.patch(f'/transactions/{TX1.id}', {'pending': False})
        self.assertEqual(response.status_code, 200)

        response = self.client.patch(f'/transactions/{TX1.id}', immutable_data2)
        self.assertEqual(response.status_code, 200)

        for field, value in immutable_data2.items():
            self.assertNotEqual(response.data[field], value, {field: value})

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