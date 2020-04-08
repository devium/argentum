import logging

from api.tests.data.configs import TestConfigs
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase
LOG = logging.getLogger(__name__)


class ConfigViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestConfigs]

    def test_list(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test('/config', TestConfigs.SAVED)

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/config', TestConfigs)

    def test_update_readonly(self):
        self.login(TestUsers.ADMIN_EXT)
        obj = TestConfigs.POSTPAID_LIMIT

        mutable_fields = {
            'value': '-10.00',
        }
        immutable_fields = {
            'key': 'prepaid_limit'
        }

        self.assertPatchReadonly(f'/config/{obj.id}', mutable_fields, immutable_fields)

    def test_permissions(self):
        self.perform_permission_test(
            '/config',
            list_users=TestUsers.SAVED_EXT,
            retrieve_users=[],
            create_users=[],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[],
            detail_id=TestConfigs.POSTPAID_LIMIT.id
        )

    def test_str(self):
        obj = TestConfigs.POSTPAID_LIMIT
        LOG.debug(obj)
        self.assertEqual(
            str(obj),
            f'Config(id={TestConfigs.POSTPAID_LIMIT.id},key="postpaid_limit",value="0.00")'
        )
