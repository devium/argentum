import logging

from api.models import Guest
from api.tests.data.guests import GUESTS, ROBY, SHEELAH, ROBY_MIN, ROBY_MAX
from api.tests.data.users import RECEPTION, ADMIN
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class GuestViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(RECEPTION)

        response = self.client.get('/guests')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, GUESTS)

    def test_get_search(self):
        self.login(RECEPTION)

        response = self.client.get('/guests?code=001')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, [ROBY])

        response = self.client.get('/guests?name=roby')
        self.assertPks(response.data, [ROBY])

        response = self.client.get('/guests?mail=rbrush')
        self.assertPks(response.data, [ROBY])

        response = self.client.get('/guests?status=staff')
        self.assertPks(response.data, [ROBY])

        response = self.client.get('/guests?code=DEMO-0000&mail=tuttocitta')
        self.assertPks(response.data, [SHEELAH])

    def test_get_serialize(self):
        self.login(RECEPTION)

        response = self.client.get('/guests')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/guests'])

    def test_post_deserialize_min(self):
        self.login(RECEPTION)

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POST/guests#min'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), [ROBY_MIN])

    def test_post_deserialize_max(self):
        self.login(RECEPTION)

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POST/guests#max'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), [ROBY_MAX])

    def test_patch_readonly(self):
        self.login(ADMIN)

        immutable_fields = {
            'code': '123',
            'name': 'Jimmy',
            'mail': 'jimmy@cherpcherp.org',
            'status': 'special',
            'card': '1212',
            'balance': '5.00',
            'bonus': '3.00'
        }
        self.assertPatchReadonly(f'/guests/{ROBY.id}', {}, immutable_fields)

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/guests'),
            [ADMIN, RECEPTION]
        )
        # Codes and cards need to be unique.
        body = {**self.REQUESTS['POST/guests#max'], **{'code': 'TEST', 'card': 'TEST'}}
        self.assertPermissions(
            lambda: self.client.post('/guests', body),
            [ADMIN, RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.patch('/guests/1', body),
            [ADMIN]
        )

    def test_constraints(self):
        self.login(ADMIN)

        body = {**self.REQUESTS['POST/guests#max'], **{'card': 'TEST'}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['code'][0], 'guest with this code already exists.')

        body = {**self.REQUESTS['POST/guests#max'], **{'code': 'TEST'}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['card'][0], 'guest with this card already exists.')

    def test_str(self):
        LOG.debug(ROBY)
        self.assertEqual(
            str(ROBY),
            'Guest(id=1,name="Roby Brushfield",code="DEMO-00001")'
        )
