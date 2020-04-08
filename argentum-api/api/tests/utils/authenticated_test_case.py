from typing import Callable, Iterable

from django.test import TestCase
from rest_framework.response import Response

from api.tests.data.users import TestUsers


class AuthenticatedTestCase(TestCase):
    token = ''

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def login(self, user: TestUsers.UserExt):
        self.logout()
        response = self.client.post('/token', {
            'username': user.obj.username,
            'password': user.plain_password
        })
        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data['token'])
        self.token = response.data['token']
        self.client.defaults['HTTP_AUTHORIZATION'] = 'Token ' + self.token

    def logout(self):
        self.token = None
        self.client.defaults.pop('HTTP_AUTHORIZATION', None)

    def assertPermissions(
            self,
            request: Callable[[], Response],
            allowed_users: Iterable[TestUsers.UserExt],
            expected_errors=None
    ):
        """
        Executes a given request for all users in USERS and asserts that only the specified users are allowed to do so.
        Database is rolled back after each request. Changes made to the database before this function is called will be
        lost. That includes valid login tokens.
        """
        if expected_errors is None:
            expected_errors = [403, 405]

        for user in allowed_users:
            self._fixture_teardown()
            self._fixture_setup()
            self.login(user)
            response = request()
            self.assertLess(
                response.status_code,
                300,
                f'Permission check failed for {user}: {getattr(response, "data", None)}'
            )

        forbidden_users = [user for user in TestUsers.SAVED_EXT if user not in allowed_users]
        for user in forbidden_users:
            self._fixture_teardown()
            self._fixture_setup()
            self.login(user)
            response = request()
            self.assertIn(
                response.status_code,
                expected_errors,
                f'Prohibition check failed for {user.obj}: {getattr(response, "data", None)}'
            )

        self._fixture_teardown()
        self._fixture_setup()
