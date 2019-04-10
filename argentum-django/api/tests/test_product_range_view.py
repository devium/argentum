import logging

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
        self.login(TestUsers.BAR)

        response = self.client.get('/product_ranges')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestProductRanges.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/product_ranges')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/product_ranges'])

    def test_post_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/product_ranges', self.REQUESTS['POST/product_ranges'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(ProductRange.objects.all(), TestProductRanges.ALL + [TestProductRanges.JUST_COKE])
        # ManyToMany relationships need to be checked manually via their queryset (original one works).
        self.assertValueEqual(TestProductRanges.JUST_COKE.products.all(), [TestProducts.COKE])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/product_ranges'),
            [TestUsers.ADMIN, TestUsers.BAR]
        )
        self.assertPermissions(
            lambda: self.client.post('/product_ranges', self.REQUESTS['POST/product_ranges']),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestProductRanges.JUST_WATER)
        self.assertEqual(str(TestProductRanges.JUST_WATER), 'ProductRange(id=1,name="Just water",num_products=1)')
