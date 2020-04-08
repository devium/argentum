import logging

from api.tests.data.groups import TestGroups
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestGroups]

    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/groups', TestGroups.SAVED)

    def test_permissions(self):
        # Groups have neither retrieve, nor update, nor destroy, so detail urls are a 404 instead of a 405.
        self.perform_permission_test(
            '/groups',
            list_users=TestUsers.SAVED_EXT,
            retrieve_users=[],
            create_users=[],
            delete_users=[],
            detail_id=TestGroups.ADMIN.id,
            detail_404=True
        )
