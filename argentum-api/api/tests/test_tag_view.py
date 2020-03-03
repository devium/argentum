import logging

from api.tests.data.guests import TestGuests
from api.tests.data.tags import TestTags
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class TagViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.WARDROBE)

        response = self.client.get('/tags')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestTags.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/tags'])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/tags'), [TestUsers.ADMIN, TestUsers.WARDROBE])
        # Detail requests yield a 404 because those endpoints aren't even created.
        self.assertPermissions(
            lambda: self.client.get(f'/tags/{TestTags.TWO.id}'),
            [],
            expected_errors=[404]
        )
        self.assertPermissions(
            lambda: self.client.post('/tags', self.REQUESTS['POST/tags']),
            []
        )
        self.assertPermissions(
            lambda: self.client.patch(f'/tags/{TestTags.TWO.id}', self.REQUESTS[f'PATCH/tags/{TestTags.TWO.id}']),
            [],
            expected_errors=[404]
        )
        self.assertPermissions(lambda: self.client.delete(f'/tags/{TestTags.TWO.id}'), [], expected_errors=[404])

    def test_str(self):
        LOG.debug(TestTags.TWO)
        self.assertEqual(
            str(TestTags.TWO),
            f'Tag(id=1,label=2,guest={TestGuests.ROBY})'
        )
