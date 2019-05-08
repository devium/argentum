import logging

from api.models import Transaction, BonusTransaction, Order
from api.models.guest import Guest
from api.tests.data.guests import TestGuests
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class GuestViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.RECEPTION)

        response = self.client.get('/guests')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestGuests.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/guests'])

    def test_get_ordered(self):
        self.login(TestUsers.RECEPTION)

        response = self.client.get('/guests?ordering=-code')
        self.assertPksEqual(response.data, [TestGuests.SHEELAH, TestGuests.ROBY])

        response = self.client.get('/guests?ordering=-balance')
        self.assertPksEqual(response.data, [TestGuests.SHEELAH, TestGuests.ROBY])

    def test_get_search(self):
        self.login(TestUsers.RECEPTION)

        response = self.client.get('/guests?code=001')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?name=roby')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?mail=rbrush')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?status=1')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?status=null')
        self.assertPksEqual(response.data, [])

        response = self.client.get('/guests?code=DEMO&name=el&mail=sohu.com')
        self.assertPksEqual(response.data, [TestGuests.ROBY])
        self.assertJSONEqual(response.content, self.RESPONSES['GET/guests?code=DEMO&name=el&mail=sohu.com'])

        response = self.client.get(f'/guests?card={TestGuests.ROBY.card}')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES[f'GET/guests?card={TestGuests.ROBY.card}'])

        response = self.client.get('f/guests?card=notfound')
        self.assertEqual(response.status_code, 404)

    def test_post_min(self):
        self.login(TestUsers.RECEPTION)
        identifier = 'POST/guests#min'

        response = self.client.post('/guests', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), TestGuests.ALL + [TestGuests.JOHANNA_MIN])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_post_max(self):
        self.login(TestUsers.RECEPTION)
        identifier = 'POST/guests#max'

        response = self.client.post('/guests', self.REQUESTS['POST/guests#max'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), TestGuests.ALL + [TestGuests.JOHANNA_MAX])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch(self):
        self.login(TestUsers.RECEPTION)
        identifier = f'PATCH/guests/{TestGuests.ROBY.id}'

        response = self.client.patch(f'/guests/{TestGuests.ROBY.id}', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(
            Guest.objects.filter(id=TestGuests.ROBY.id),
            [TestGuests.ROBY_PATCHED]
        )
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch_readonly(self):
        self.login(TestUsers.ADMIN)

        mutable_fields = {
            'checked_in': "2019-12-31T22:01:00Z",
            'code': '123',
            'name': 'Jimmy',
            'mail': 'jimmy@cherpcherp.org',
            'status': 2,
            'card': '1212',
        }
        immutable_fields = {
            'balance': '5.00',
            'bonus': '3.00'
        }
        self.assertPatchReadonly(f'/guests/{TestGuests.ROBY.id}', mutable_fields, immutable_fields)

    def test_list_patch(self):
        self.login(TestUsers.RECEPTION)
        identifier = 'PATCH/guests/list_update'

        response = self.client.patch('/guests/list_update', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertPksEqual(response.data, [TestGuests.JOHANNA_MIN, TestGuests.ROBY_LIST_PATCHED])
        self.assertValueEqual(
            Guest.objects.all(),
            [TestGuests.ROBY_LIST_PATCHED, TestGuests.SHEELAH, TestGuests.JOHANNA_MIN]
        )
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_list_patch_only(self):
        # Don't remember why this test was added but better leave it in there.
        self.login(TestUsers.RECEPTION)
        response = self.client.patch('/guests/list_update', [self.REQUESTS['PATCH/guests/list_update'][0]])
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestGuests.ROBY_LIST_PATCHED])
        self.assertValueEqual(Guest.objects.all(), [TestGuests.ROBY_LIST_PATCHED, TestGuests.SHEELAH])

    def test_delete_all(self):
        self.login(TestUsers.ADMIN)
        response = self.client.delete('/guests/delete_all')
        self.assertEqual(response.status_code, 204)
        self.assertValueEqual(Guest.objects.all(), [])
        self.assertValueEqual(Transaction.objects.all(), [])
        self.assertValueEqual(BonusTransaction.objects.all(), [])
        self.assertValueEqual(Order.objects.all(), [])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/guests'),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/guests/{TestGuests.ROBY.id}'),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.post('/guests', self.REQUESTS['POST/guests#max']),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/guests?card={TestGuests.ROBY.card}'),
            [TestUsers.ADMIN, TestUsers.TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/guests?mail={TestGuests.ROBY.mail}'),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.patch(f'/guests/{TestGuests.ROBY.id}', self.REQUESTS['POST/guests#max']),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.patch('/guests/list_update', self.REQUESTS['PATCH/guests/list_update']),
            [TestUsers.ADMIN, TestUsers.RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.delete('/guests/delete_all'),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(lambda: self.client.delete('/guests/1'), [])

    def test_constraints(self):
        self.login(TestUsers.ADMIN)

        # Empty card is allowed.
        body = {**self.REQUESTS['POST/guests#max'], **{'card': None}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 201)

        # Code has to be unique.
        body = {**self.REQUESTS['POST/guests#max'], **{'code': TestGuests.ROBY.code, 'card': 'CARD1'}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['code'][0], 'guest with this code already exists.')

        # Card has to be unique.
        body = {**self.REQUESTS['POST/guests#max'], **{'code': 'CODE1', 'card': TestGuests.ROBY.card}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['card'][0], 'guest with this card already exists.')

    def test_str(self):
        LOG.debug(TestGuests.ROBY)
        self.assertEqual(
            str(TestGuests.ROBY),
            'Guest(id=1,name="Roby Brushfield",code="DEMO-00001")'
        )
