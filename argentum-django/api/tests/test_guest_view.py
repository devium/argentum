from api.models import Guest
from api.tests.data.guests import GUESTS, ROBY, SHEELAH, ROBY_MIN, ROBY_MAX
from api.tests.data.users import RECEPTION, ADMIN
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase


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

    def test_post_deserialize(self):
        self.login(RECEPTION)

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POSTmin/guests'])
        self.assertEqual(response.status_code, 201)
        self.assertDeserialization(Guest.objects.all(), [ROBY_MIN])

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POSTmax/guests'])
        self.assertEqual(response.status_code, 201)
        self.assertDeserialization(Guest.objects.all(), [ROBY_MAX])

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
        self.assertPermissions(
            lambda: self.client.post('/guests', self.REQUESTS['POSTmax/guests']),
            [ADMIN, RECEPTION],
            [Guest.objects.all()]
        )
