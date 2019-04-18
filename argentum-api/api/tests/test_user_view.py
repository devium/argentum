import logging

from django.contrib.auth.models import User

from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/users')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestUsers.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/users')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/users'])

    def test_post_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/users', self.REQUESTS['POST/users'])
        self.assertEqual(response.status_code, 201)
        self.assertPksEqual([response.data], [TestUsers.BUFFET])
        self.login(TestUsers.BUFFET)

    def test_patch_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.patch('/users/3', self.REQUESTS['PATCH/users/3'])
        self.assertEqual(response.status_code, 200)
        # Manual check necessary due to users and groups being special cases.
        wardrobe_groups = User.objects.get(pk=TestUsers.WARDROBE.id).groups.all()
        self.assertEqual(wardrobe_groups.count(), 2)
        self.assertEqual([group.id for group in wardrobe_groups], [2, 4])
        self.login(TestUsers.WARDROBE_PATCHED)

    def test_get_me(self):
        self.login(TestUsers.RECEPTION)

        response = self.client.get('/users/me')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/users/me'])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/users'),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.post('/users', self.REQUESTS['POST/users']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.patch('/users/3', self.REQUESTS['PATCH/users/3']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.get('/users/me'),
            TestUsers.ALL
        )
        self.assertPermissions(
            lambda: self.client.delete('/users/1'),
            [TestUsers.ADMIN]
        )
        self.logout()
        response = self.client.get('/users/me')
        self.assertEqual(response.status_code, 401)
