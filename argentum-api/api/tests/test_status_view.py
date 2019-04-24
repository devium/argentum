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
        self.assertJSONEqual(response.content, self.RESPONSES['GET/statuses'])

    def test_post(self):
        self.login(TestUsers.ADMIN)
        identifier = 'POST/statuses'

        response = self.client.post('/statuses', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Status.objects.all(), TestStatuses.ALL + [TestStatuses.STAFF])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch(self):
        self.login(TestUsers.ADMIN)
        identifier = f'PATCH/statuses/{TestStatuses.PENDING.id}'

        response = self.client.patch(f'/statuses/{TestStatuses.PENDING.id}', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(Status.objects.all(), [TestStatuses.PAID, TestStatuses.PENDING_PATCHED])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/statuses'), TestUsers.ALL)
        self.assertPermissions(lambda: self.client.post('/statuses', self.REQUESTS['POST/statuses']), [TestUsers.ADMIN])
        self.assertPermissions(lambda: self.client.delete('/statuses/1'), [TestUsers.ADMIN])

    def test_str(self):
        LOG.debug(TestStatuses.PAID)
        self.assertEqual(
            str(TestStatuses.PAID),
            'Status(id=1,internal_name="paid",display_name="Paid",color="#00ff00")'
        )
