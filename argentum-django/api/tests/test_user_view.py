import logging

from api.tests.data.users import ADMIN, USERS, BUFFET, WARDROBE_PATCHED
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(ADMIN)

        response = self.client.get('/users')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, USERS)

    def test_get_serialize(self):
        self.login(ADMIN)

        response = self.client.get('/users')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/users'])

    def test_post_deserialize(self):
        self.login(ADMIN)

        response = self.client.post('/users', self.REQUESTS['POST/users'])
        self.assertEqual(response.status_code, 201)
        self.assertPksEqual([response.data], [BUFFET])
        self.login(BUFFET)

    def test_patch_deserialize(self):
        self.login(ADMIN)

        response = self.client.patch('/users/3', self.REQUESTS['PATCH/users/3'])
        self.assertEqual(response.status_code, 200)
        self.login(WARDROBE_PATCHED)

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/users'),
            [ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.post('/users', self.REQUESTS['POST/users']),
            [ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.patch('/users/3', self.REQUESTS['PATCH/users/3']),
            [ADMIN]
        )
