import logging

from api.models.status import Status
from api.tests.data.statuses import TestStatuses
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class StatusViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.TERMINAL_EXT)
        self.perform_list_test('/statuses', TestStatuses.SAVED)

    def test_create(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/statuses', TestStatuses)

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/statuses', TestStatuses)

    def test_permissions(self):
        self.perform_permission_test(
            '/statuses',
            list_users=TestUsers.SAVED_EXT,
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[TestUsers.ADMIN_EXT],
            detail_id=TestStatuses.PAID.id
        )

    def test_str(self):
        LOG.debug(TestStatuses.PAID)
        self.assertEqual(
            str(TestStatuses.PAID),
            f'Status(id={TestStatuses.PAID.id},internal_name="paid",display_name="Paid",color="#00ff00")'
        )
