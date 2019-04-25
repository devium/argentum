import logging

from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class StatisticsViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/statistics')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/statistics'])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/statistics'), [TestUsers.ADMIN])
        self.assertPermissions(lambda: self.client.get('/statistics/1'), [], expected_errors=[404])
        self.assertPermissions(lambda: self.client.post('/statistics', {}), [])
        self.assertPermissions(lambda: self.client.patch('/statistics/1', {}), [], expected_errors=[404])
        self.assertPermissions(lambda: self.client.delete('/statistics/1'), [], expected_errors=[404])
