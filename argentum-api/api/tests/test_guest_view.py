import copy
import logging

from api.models import Transaction, BonusTransaction, Order, Tag, OrderItem
from api.models.guest import Guest
from api.models.label import Label
from api.tests.data.guests import TestGuests
from api.tests.data.statuses import TestStatuses
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class GuestViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestGuests]

    def test_list(self):
        self.login(TestUsers.RECEPTION_EXT)
        self.perform_list_test('/guests', TestGuests.SAVED)

    def test_list_ordered(self):
        self.login(TestUsers.RECEPTION_EXT)

        response = self.client.get('/guests?ordering=-code')
        self.assertPksEqual(response.data, [TestGuests.SHEELAH, TestGuests.ROBY])

        response = self.client.get('/guests?ordering=balance')
        self.assertPksEqual(response.data, [TestGuests.SHEELAH, TestGuests.ROBY])

    def test_list_search(self):
        self.login(TestUsers.RECEPTION_EXT)

        response = self.client.get('/guests?code=001')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?name=roby')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?mail=rbrush')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get(f'/guests?status={TestStatuses.PAID.id}')
        self.assertPksEqual(response.data, [TestGuests.ROBY])

        response = self.client.get('/guests?status=null')
        self.assertPksEqual(response.data, [])

        url = '/guests?code=DEMO&name=el&mail=sohu.com'
        expected_response = copy.deepcopy(self.RESPONSES[f'GET{url}'])
        self.patch_json_ids(expected_response)
        response = self.client.get(url)
        self.assertPksEqual(response.data, [TestGuests.ROBY])
        self.assertJSONEqual(response.content, expected_response)

        url = f'/guests?card={TestGuests.ROBY.card}'
        expected_response = copy.deepcopy(self.RESPONSES[f'GET{url}'])
        self.patch_json_ids(expected_response)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, expected_response)

        response = self.client.get('f/guests?card=notfound')
        self.assertEqual(response.status_code, 404)

    def test_create_min(self):
        self.login(TestUsers.RECEPTION_EXT)
        self.perform_create_test('/guests', TestGuests, '#min', '#min')

    def test_create_max(self):
        self.login(TestUsers.RECEPTION_EXT)
        self.perform_create_test('/guests', TestGuests, '#max', '#max')

    def test_update(self):
        self.login(TestUsers.RECEPTION_EXT)
        self.perform_update_test('/guests', TestGuests)

    def test_patch_readonly(self):
        self.login(TestUsers.ADMIN_EXT)

        mutable_fields = {
            'checked_in': "2019-12-31T22:01:00Z",
            'code': '123',
            'name': 'Jimmy',
            'mail': 'jimmy@cherpcherp.org',
            'status': TestStatuses.PAID.id,
            'card': '1212',
        }
        immutable_fields = {
            'balance': '5.00',
            'bonus': '3.00'
        }
        self.assertPatchReadonly(f'/guests/{TestGuests.ROBY.id}', mutable_fields, immutable_fields)

    def test_list_create_update(self):
        self.login(TestUsers.RECEPTION_EXT)
        identifier = 'PATCH/guests/list_update'
        expected_response = copy.deepcopy(self.RESPONSES[identifier])

        request = self.REQUESTS[identifier]
        response = self.client.patch('/guests/list_update', request)
        self.assertEqual(response.status_code, 201)
        self.patch_object_ids(expected_response, response.data)
        self.assertValueEqual(
            Guest.objects.all(),
            [TestGuests.ROBY_LIST_PATCHED, TestGuests.SHEELAH, TestGuests.JOHANNA_MIN]
        )
        self.patch_json_ids(expected_response)
        self.assertJSONEqual(response.content, expected_response)

    def test_delete_all(self):
        self.login(TestUsers.ADMIN_EXT)
        response = self.client.delete('/guests/delete_all')
        self.assertEqual(response.status_code, 204)
        self.assertValueEqual(Guest.objects.all(), [])
        self.assertValueEqual(Transaction.objects.all(), [])
        self.assertValueEqual(BonusTransaction.objects.all(), [])
        self.assertValueEqual(Order.objects.all(), [])
        self.assertValueEqual(OrderItem.objects.all(), [])
        self.assertValueEqual(Tag.objects.all(), [])
        self.assertValueEqual(Label.objects.all(), [])

    def test_permissions(self):
        self.perform_permission_test(
            '/guests',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT],
            list_by_card_users=[TestUsers.ADMIN_EXT, TestUsers.TERMINAL_EXT, TestUsers.RECEPTION_EXT],
            retrieve_users=[TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT],
            create_users=[TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT],
            delete_users=[],
            card_parameter='card',
            card=TestGuests.ROBY.card,
            detail_id=TestGuests.ROBY.id,
            create_suffix='#max'
        )
        self.assertPermissions(
            lambda: self.client.get(f'/guests?mail={TestGuests.ROBY.mail}'),
            [TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT]
        )
        self.assertPermissions(
            lambda: self.client.patch('/guests/list_update', self.REQUESTS['PATCH/guests/list_update']),
            [TestUsers.ADMIN_EXT, TestUsers.RECEPTION_EXT]
        )
        self.assertPermissions(
            lambda: self.client.delete('/guests/delete_all'),
            [TestUsers.ADMIN_EXT]
        )

    def test_constraints(self):
        self.login(TestUsers.ADMIN_EXT)

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
            f'Guest(id={TestGuests.ROBY.id},name="Roby Brushfield",code="DEMO-00001")'
        )
