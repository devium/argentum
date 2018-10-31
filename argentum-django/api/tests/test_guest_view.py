from django.test import TestCase

from api.models import Guest
from api.tests.guests import GUESTS, JIMMY, NORBERT
from api.tests.populate_db import populate_db


class GuestViewTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        populate_db()

    def test_get(self):
        response = self.client.get('/guests')
        self.assertEqual(response.status_code, 200)
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], GUESTS)

    def test_get_search(self):
        response = self.client.get('/guests?code=vvjames')
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], [JIMMY])

        response = self.client.get('/guests?name=james the')
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], [JIMMY])

        response = self.client.get('/guests?mail=jimmy')
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], [JIMMY])

        response = self.client.get('/guests?status=default')
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], [NORBERT, JIMMY])

        response = self.client.get('/guests?name=the&mail=norby')
        self.assertEqual([Guest(**guest_data) for guest_data in response.data], [NORBERT])
