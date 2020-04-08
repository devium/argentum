import logging

from django.contrib.auth.models import Group, Permission

from api.models.product_range import ProductRange
from api.tests.data.categories import TestCategories
from api.tests.data.product_ranges import TestProductRanges
from api.tests.data.products import TestProducts
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class ProductRangeViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/product_ranges', TestProductRanges.SAVED)

    def test_retrieve(self):
        self.login(TestUsers.BAR_EXT)
        response = self.client.get(f'/product_ranges/{TestProductRanges.JUST_WATER.id}')
        self.assertEqual(response.status_code, 200)
        expected_response = self.RESPONSES[f'GET/product_ranges/']
        self.patch_json_ids(expected_response)
        self.assertJSONEqual(response.content, expected_response)

    def test_create(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/product_ranges', TestProductRanges)

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/product_ranges', TestProductRanges)

    def test_create_permissions(self):
        self.login(TestUsers.ADMIN_EXT)

        response = self.client.post('/product_ranges', self.REQUESTS['POST/product_ranges'])
        self.assertEqual(response.status_code, 201)
        TestProductRanges.JUST_COKE.id = ProductRange.objects.get(name=TestProductRanges.JUST_COKE.name).id
        group = f'product_range_{TestProductRanges.JUST_COKE.id}'
        permission = f'view_productrange_{TestProductRanges.JUST_COKE.id}'
        self.assertTrue(Group.objects.filter(name=group).exists())
        self.assertTrue(Permission.objects.filter(codename=permission).exists())

    def test_destroy_permissions(self):
        self.login(TestUsers.ADMIN_EXT)

        group = f'product_range_{TestProductRanges.EVERYTHING.id}'
        permission = f'view_productrange_{TestProductRanges.EVERYTHING.id}'
        self.assertTrue(Group.objects.filter(name=group).exists())
        self.assertTrue(Permission.objects.filter(codename=permission).exists())

        response = self.client.delete(f'/product_ranges/{TestProductRanges.EVERYTHING.id}')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Group.objects.filter(name=group).exists())
        self.assertFalse(Permission.objects.filter(codename=permission).exists())

    def test_permissions(self):
        self.perform_permission_test(
            '/product_ranges',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT],
            retrieve_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[TestUsers.ADMIN_EXT],
            detail_id=TestProductRanges.JUST_WATER.id
        )
        # General access to list action.
        self.assertPermissions(
            lambda: self.client.get('/product_ranges'),
            [TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT]
        )
        # Results should be filtered according to permissions.
        self.login(TestUsers.ADMIN_EXT)
        response = self.client.get('/product_ranges')
        self.assertPksEqual(response.data, TestProductRanges.SAVED)
        self.login(TestUsers.BAR_EXT)
        response = self.client.get('/product_ranges')
        self.assertPksEqual(response.data, [TestProductRanges.JUST_WATER])

        # Individual access should be subject to individual permissions.
        self.assertPermissions(
            lambda: self.client.get(f'/product_ranges/{TestProductRanges.JUST_WATER.id}'),
            [TestUsers.ADMIN_EXT, TestUsers.BAR_EXT]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/product_ranges/{TestProductRanges.EVERYTHING.id}'),
            [TestUsers.ADMIN_EXT]
        )

    def test_str(self):
        LOG.debug(TestProductRanges.JUST_WATER)
        self.assertEqual(
            str(TestProductRanges.JUST_WATER),
            f'ProductRange(id={TestProductRanges.JUST_WATER.id},name="Just water",num_products=1)'
        )
