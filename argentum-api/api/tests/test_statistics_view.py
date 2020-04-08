import logging

from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class StatisticsViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)

        expected_response = self.RESPONSES['GET/statistics']
        response = self.client.get('/statistics')

        self.assertEqual(response.status_code, 200)
        self.patch_json_ids(expected_response)
        self.assertJSONEqual(response.content, expected_response)

    def test_permissions(self):
        self.perform_permission_test(
            '/statistics',
            list_users=[TestUsers.ADMIN_EXT],
            retrieve_users=[],
            create_users=[],
            update_users=[],
            delete_users=[],
            detail_id=1,
            detail_404=True
        )
