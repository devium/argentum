import logging

from api.models.status import Status
from api.tests.data.statuses import STATUSES, STAFF, PAID
from api.tests.data.users import BAR, ADMIN, WARDROBE, TERMINAL, RECEPTION, TOPUP
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class StatusViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TERMINAL)

        response = self.client.get('/statuses')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, STATUSES)

    def test_get_serialize(self):
        self.login(TERMINAL)

        response = self.client.get('/statuses')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/statuses'])

    def test_post_deserialize(self):
        self.login(ADMIN)

        response = self.client.post('/statuses', self.REQUESTS['POST/statuses'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Status.objects.all(), STATUSES + [STAFF])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/statuses'),
            [ADMIN, RECEPTION, TOPUP, BAR, WARDROBE, TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/statuses', self.REQUESTS['POST/statuses']),
            [ADMIN]
        )

    def test_str(self):
        LOG.debug(PAID)
        self.assertEqual(
            str(PAID),
            'Status(id=1,internal_name="paid",display_name="Paid",color="#00ff00")'
        )
