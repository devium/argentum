from django.contrib.auth.models import User

from api.tests.utils.serialization_test_case import SerializationTestCase


class AuthenticationTestCase(SerializationTestCase):
    def test_default_users(self):
        self.assertEqual(User.objects.count(), 1)
        admin = User.objects.all()[0]
        self.assertEqual(admin.username, 'admin')

    def test_get_token(self):
        response = self.client.post('/token', self.REQUESTS['POSTadmin/token'])
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
