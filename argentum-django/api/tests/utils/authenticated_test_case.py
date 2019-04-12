from typing import Callable, Iterable

from django.test import TestCase
from rest_framework.response import Response

from api.tests.data.users import TestUsers


class AuthenticatedTestCase(TestCase):
    token = ''

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def login(self, user: TestUsers.PlainUser):
        self.logout()
        response = self.client.post('/token', {
            'username': user.username,
            'password': user.password
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['token'])
        self.token = response.data['token']
        self.client.defaults['HTTP_AUTHORIZATION'] = 'Token ' + self.token

    def logout(self):
        self.token = None
        self.client.defaults.pop('HTTP_AUTHORIZATION', None)

    def assertPermissions(
            self,
            request: Callable[[], Response],
            allowed_users: Iterable[TestUsers.PlainUser]
    ):
        """
        Executes a given request for all users in USERS and asserts that only the specified users are allowed to do so.
        Database is rolled back after each request. Changes made to the database before this function is called will be
        lost. That includes valid login tokens.
        """
        for user in allowed_users:
            self._fixture_teardown()
            self._fixture_setup()
            self.login(user)
            response = request()
            self.assertLess(response.status_code, 300, f'Permission check failed for {user}: {response.data}')

        forbidden_users = [user for user in TestUsers.ALL if user not in allowed_users]
        for user in forbidden_users:
            self._fixture_teardown()
            self._fixture_setup()
            self.login(user)
            response = request()
            self.assertEqual(response.status_code, 403, f'Prohibition check failed for {user}: {response.data}')

        self._fixture_teardown()
        self._fixture_setup()
