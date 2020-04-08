import logging

from api.tests.data.categories import TestCategories
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class CategoryViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestCategories]

    def test_list(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test('/categories', TestCategories.SAVED)

    def test_create(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/categories', TestCategories)

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/categories', TestCategories)

    def test_permissions(self):
        self.perform_permission_test(
            '/categories',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[TestUsers.ADMIN_EXT],
            detail_id=TestCategories.SOFT_DRINKS.id
        )

    def test_str(self):
        LOG.debug(TestCategories.SOFT_DRINKS)
        self.assertEqual(
            str(TestCategories.SOFT_DRINKS),
            f'Category(id={TestCategories.SOFT_DRINKS.id},name="Soft drinks",color="#00ffff")'
        )
