import logging

from api.tests.data.groups import TestGroups
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/groups')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestGroups.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/groups'])

    def test_permissions(self):
        # Groups have neither retrieve, nor update, nor destroy, so detail urls are a 404 instead of a 405.
        self.assertPermissions(lambda: self.client.get('/groups'), [TestUsers.ADMIN])
        self.assertPermissions(lambda: self.client.get(f'/groups/{TestGroups.ADMIN.id}'), [], expected_errors=[404])
        self.assertPermissions(lambda: self.client.post('/groups', {}), [])
        self.assertPermissions(
            lambda: self.client.patch(f'/groups/{TestGroups.ADMIN.id}', {}),
            [],
            expected_errors=[404]
        )
        self.assertPermissions(
            lambda: self.client.delete(f'/groups/{TestGroups.ADMIN.id}'),
            [],
            expected_errors=[404]
        )
