from api.models import Guest
from api.tests.data.guests import GUESTS, JIMMY, NORBERT, NORBERT_DEFAULT, JIMMY_EXPLICIT
from api.tests.data.users import RECEPTION, ADMIN
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase


class GuestViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(RECEPTION)

        response = self.client.get('/guests')
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, GUESTS)

    def test_get_search(self):
        self.login(RECEPTION)

        response = self.client.get('/guests?code=vvjames')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, [JIMMY])

        response = self.client.get('/guests?name=james the')
        self.assertPks(response.data, [JIMMY])

        response = self.client.get('/guests?mail=jimmy')
        self.assertPks(response.data, [JIMMY])

        response = self.client.get('/guests?status=default')
        self.assertPks(response.data, [NORBERT, JIMMY])

        response = self.client.get('/guests?name=the&mail=norby')
        self.assertPks(response.data, [NORBERT])

    def test_get_serialize(self):
        self.login(RECEPTION)

        response = self.client.get('/guests')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/guests'])

    def test_post_deserialize(self):
        self.login(RECEPTION)

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POSTdefault/guests'])
        self.assertEqual(response.status_code, 201)
        self.assertDeserialization(Guest.objects.all(), [NORBERT_DEFAULT])

        Guest.objects.all().delete()
        response = self.client.post('/guests', self.REQUESTS['POSTexplicit/guests'])
        self.assertEqual(response.status_code, 201)
        self.assertDeserialization(Guest.objects.all(), [JIMMY_EXPLICIT])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/guests'),
            [ADMIN, RECEPTION]
        )
        self.assertPermissions(
            lambda: self.client.post('/guests', self.REQUESTS['POSTexplicit/guests']),
            [ADMIN, RECEPTION],
            [Guest.objects.all()]
        )
