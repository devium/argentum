import logging

from api.models.product import Product
from api.tests.data.product_ranges import TestProductRanges
from api.tests.data.products import TestProducts
from api.tests.data.users import TestUsers
from api.tests.data.categories import TestCategories
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class ProductViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test('/products', TestProducts.SAVED)

    def test_create_min(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/products', TestProducts, '#min', '#min')

    def test_post_max(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/products', TestProducts, '#max', '#max')

    def test_create_empty_ranges(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/products', TestProducts, '#empty_ranges', '#empty_ranges')

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/products', TestProducts)

    def test_update_deprecate(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/products', TestProducts, '#deprecate')

    def test_permissions(self):
        self.perform_permission_test(
            '/products',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[],
            detail_id=TestProducts.WATER.id,
            create_suffix='#min'
        )

    def test_str(self):
        LOG.debug(TestProducts.WATER)
        self.assertEqual(
            str(TestProducts.WATER),
            f'Product('
            f'id={TestProducts.WATER.id},'
            f'name="Water",'
            f'deprecated=False,'
            f'price=2.40,'
            f'category={TestCategories.SOFT_DRINKS}'
            f')'
        )
