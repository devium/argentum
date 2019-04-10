import logging

from django.utils.dateparse import parse_datetime

from api.models.guest import Guest
from api.tests.data.guests import GUESTS, ROBY, SHEELAH, JOHANNA_MIN, JOHANNA_MAX, ROBY_PATCHED
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
        self.assertPksEqual(response.data, GUESTS)

    def test_get_search(self):
        self.login(RECEPTION)

        response = self.client.get('/guests?code=001')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, [ROBY])

        response = self.client.get('/guests?name=roby')
        self.assertPksEqual(response.data, [ROBY])

        response = self.client.get('/guests?mail=rbrush')
        self.assertPksEqual(response.data, [ROBY])

        response = self.client.get('/guests?status=staff')
        self.assertPksEqual(response.data, [ROBY])

        response = self.client.get('/guests?code=DEMO-0000&mail=tuttocitta')
        self.assertPksEqual(response.data, [SHEELAH])

    def test_get_serialize(self):
        self.login(RECEPTION)

        response = self.client.get('/guests')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/guests'])

    def test_post_deserialize_min(self):
        self.login(RECEPTION)

        response = self.client.post('/guests', self.REQUESTS['POST/guests#min'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), GUESTS + [JOHANNA_MIN])

    def test_post_deserialize_max(self):
        self.login(RECEPTION)

        response = self.client.post('/guests', self.REQUESTS['POST/guests#max'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Guest.objects.all(), GUESTS + [JOHANNA_MAX])

    def test_patch_readonly(self):
        self.login(ADMIN)

        mutable_fields = {
            'checked_in': "2019-12-31T22:01:00Z"
        }
        immutable_fields = {
            'code': '123',
            'name': 'Jimmy',
            'mail': 'jimmy@cherpcherp.org',
            'status': 'special',
            'card': '1212',
            'balance': '5.00',
            'bonus': '3.00'
        }
        self.assertPatchReadonly(f'/guests/{ROBY.id}', mutable_fields, immutable_fields)

    def test_patch_partial(self):
        # Unsure if partial patches are allowed per default. Looks like they are but this test can stay.
        self.login(RECEPTION)
        time = '2019-12-31T22:01:00Z'
        response = self.client.patch(f'/guests/{ROBY.id}', {'checked_in': time})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Guest.objects.get(pk=ROBY.id).checked_in, parse_datetime(time))

    def test_list_patch(self):
        self.login(RECEPTION)
        response = self.client.patch('/guests/list_update', self.REQUESTS['PATCH/guests/list_update'])
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(Guest.objects.all(), [ROBY_PATCHED, SHEELAH, JOHANNA_MIN])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/guests'),
            [ADMIN, RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.post('/guests', self.REQUESTS['POST/guests#max']),
            [ADMIN, RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.patch(f'/guests/{ROBY.id}', self.REQUESTS['POST/guests#max']),
            [ADMIN, RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.patch('/guests/list_update', self.REQUESTS['PATCH/guests/list_update']),
            [ADMIN, RECEPTION]
        )

    def test_constraints(self):
        self.login(ADMIN)

        # Empty card is allowed.
        body = {**self.REQUESTS['POST/guests#max'], **{'card': None}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 201)

        # Code has to be unique.
        body = {**self.REQUESTS['POST/guests#max'], **{'code': ROBY.code, 'card': 'CARD1'}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['code'][0], 'guest with this code already exists.')

        # Card has to be unique.
        body = {**self.REQUESTS['POST/guests#max'], **{'code': 'CODE1', 'card': ROBY.card}}
        response = self.client.post('/guests', body)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['card'][0], 'guest with this card already exists.')

    def test_str(self):
        LOG.debug(ROBY)
        self.assertEqual(
            str(ROBY),
            'Guest(id=1,name="Roby Brushfield",code="DEMO-00001")'
        )
