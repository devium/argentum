import logging

from api.models.status import Status
from api.tests.data.statuses import TestStatuses
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class StatusViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.TERMINAL)

        response = self.client.get('/statuses')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestStatuses.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.TERMINAL)

        response = self.client.get('/statuses')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/statuses'])

    def test_post_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/statuses', self.REQUESTS['POST/statuses'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Status.objects.all(), TestStatuses.ALL + [TestStatuses.STAFF])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/statuses'), TestUsers.ALL)
        self.assertPermissions(lambda: self.client.post('/statuses', self.REQUESTS['POST/statuses']), [TestUsers.ADMIN])

    def test_str(self):
        LOG.debug(TestStatuses.PAID)
        self.assertEqual(
            str(TestStatuses.PAID),
            'Status(id=1,internal_name="paid",display_name="Paid",color="#00ff00")'
        )
