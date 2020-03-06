import logging

from django.contrib.auth.models import Group, Permission

from api.models.product_range import ProductRange
from api.tests.data.product_ranges import TestProductRanges
from api.tests.data.products import TestProducts
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class ProductRangeViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/product_ranges')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestProductRanges.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/product_ranges'])

    def test_get_detail(self):
        self.login(TestUsers.BAR)

        response = self.client.get(f'/product_ranges/{TestProductRanges.JUST_WATER.id}')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, self.RESPONSES[f'GET/product_ranges/{TestProductRanges.JUST_WATER.id}'])

    def test_post(self):
        self.login(TestUsers.ADMIN)
        identifier = 'POST/product_ranges'

        response = self.client.post('/product_ranges', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(ProductRange.objects.all(), TestProductRanges.ALL + [TestProductRanges.JUST_COKE])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_patch(self):
        self.login(TestUsers.ADMIN)
        identifier = f'PATCH/product_ranges/{TestProductRanges.JUST_WATER.id}'

        response = self.client.patch(f'/product_ranges/{TestProductRanges.JUST_WATER.id}', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(
            ProductRange.objects.all(),
            [TestProductRanges.JUST_WATER_PATCHED, TestProductRanges.EVERYTHING]
        )
        self.assertValueEqual(TestProductRanges.JUST_WATER.products.all(), [TestProducts.WATER])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_create_permissions(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/product_ranges', self.REQUESTS['POST/product_ranges'])
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Group.objects.filter(name='product_range_3').exists())
        self.assertTrue(Permission.objects.filter(codename=f'view_productrange_3').exists())

    def test_destroy_permissions(self):
        self.login(TestUsers.ADMIN)

        self.assertTrue(Group.objects.filter(name='product_range_2').exists())
        self.assertTrue(Permission.objects.filter(codename=f'view_productrange_2').exists())

        response = self.client.delete('/product_ranges/2')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Group.objects.filter(name='product_range_2').exists())
        self.assertFalse(Permission.objects.filter(codename=f'view_productrange_2').exists())

    def test_permissions(self):
        # General access to list action.
        self.assertPermissions(
            lambda: self.client.get('/product_ranges'),
            [TestUsers.ADMIN, TestUsers.BAR]
        )
        # Results should be filtered according to permissions.
        self.login(TestUsers.ADMIN)
        response = self.client.get('/product_ranges')
        self.assertPksEqual(response.data, TestProductRanges.ALL)
        self.login(TestUsers.BAR)
        response = self.client.get('/product_ranges')
        self.assertPksEqual(response.data, [TestProductRanges.JUST_WATER])

        # Individual access should be subject to individual permissions.
        self.assertPermissions(
            lambda: self.client.get(f'/product_ranges/{TestProductRanges.JUST_WATER.id}'),
            [TestUsers.ADMIN, TestUsers.BAR]
        )
        self.assertPermissions(
            lambda: self.client.get(f'/product_ranges/{TestProductRanges.EVERYTHING.id}'),
            [TestUsers.ADMIN]
        )

        # Only admin can edit.
        self.assertPermissions(
            lambda: self.client.post('/product_ranges', self.REQUESTS['POST/product_ranges']),
            [TestUsers.ADMIN]
        )

        # Only admin can delete.
        self.assertPermissions(
            lambda: self.client.delete('/product_ranges/1'),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestProductRanges.JUST_WATER)
        self.assertEqual(str(TestProductRanges.JUST_WATER), 'ProductRange(id=1,name="Just water",num_products=1)')
