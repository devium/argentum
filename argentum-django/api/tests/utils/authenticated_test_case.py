from typing import List, Callable

from django.db.models import QuerySet
from django.test import TestCase
from rest_framework.response import Response

from api.tests.data.users import PlainUser, USERS


class AuthenticatedTestCase(TestCase):
    token = ''

    def login(self, user: PlainUser):
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
        del self.client.defaults['HTTP_AUTHORIZATION']

    def assertPermissions(
            self,
            request: Callable[[], Response],
            allowed_users: List[PlainUser],
            querysets_to_reset: List[QuerySet] = None
    ):
        if not querysets_to_reset:
            querysets_to_reset = []

        for user in allowed_users:
            for queryset in querysets_to_reset:
                queryset.delete()
            self.login(user)
            response = request()
            self.assertEqual(
                response.status_code // 100,
                2,
                f'Permission check failed for {user}: {response.data}'
            )

        forbidden_users = [user for user in USERS if user not in allowed_users]
        for user in forbidden_users:
            for queryset in querysets_to_reset:
                queryset.delete()
            self.login(user)
            response = request()
            self.assertEqual(
                response.status_code,
                403,
                f'Prohibition check failed for {user}: {response.data}'
            )
