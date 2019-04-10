import logging

from api.tests.data.groups import GROUPS
from api.tests.data.users import ADMIN
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(ADMIN)

        response = self.client.get('/groups')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, GROUPS)

    def test_get_serialize(self):
        self.login(ADMIN)

        response = self.client.get('/groups')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/groups'])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/groups'), [ADMIN])
        self.assertPermissions(lambda: self.client.post('/groups', {}), [])
        self.assertPermissions(lambda: self.client.patch('/groups/1', {}), [])
