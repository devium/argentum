import copy
import logging

from django.contrib.auth.models import User

from api.tests.data.groups import TestGroups
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class UserViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/users', TestUsers.SAVED)

    def test_post(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/users', TestUsers, ignore_fields=['password', 'date_joined'])
        self.login(TestUsers.BUFFET_EXT)

    def test_patch(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/users', TestUsers, ignore_fields=['password', 'date_joined'])
        self.login(TestUsers.WARDROBE_PATCHED_EXT)

    def test_get_me(self):
        self.login(TestUsers.RECEPTION_EXT)
        response = self.client.get('/users/me')
        expected_response = copy.deepcopy(self.RESPONSES['GET/users/me'])
        self.patch_json_ids(expected_response)
        self.assertJSONEqual(response.content, expected_response)

    def test_permissions(self):
        self.perform_permission_test(
            '/users',
            list_users=[TestUsers.ADMIN_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[TestUsers.ADMIN_EXT],
            detail_id=TestUsers.BAR.id
        )
        self.assertPermissions(lambda: self.client.get('/users/me'), TestUsers.SAVED_EXT)
        self.logout()
        response = self.client.get('/users/me')
        self.assertEqual(response.status_code, 401)
