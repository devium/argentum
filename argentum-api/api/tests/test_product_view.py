import logging

from api.models.product import Product
from api.tests.data.products import TestProducts
from api.tests.data.users import TestUsers
from api.tests.data.categories import TestCategories
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class ProductViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/products')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestProducts.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/products'])

    def test_post_min(self):
        self.login(TestUsers.ADMIN)
        identifier = 'POST/products#min'

        response = self.client.post('/products', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Product.objects.all(), TestProducts.ALL + [TestProducts.BEER_MIN])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_post_max(self):
        self.login(TestUsers.ADMIN)
        identifier = 'POST/products#max'

        response = self.client.post('/products', self.REQUESTS[identifier])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Product.objects.all(), TestProducts.ALL + [TestProducts.BEER_MAX])
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/products'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.TERMINAL]
        )
        self.assertPermissions(lambda: self.client.get(f'/products/{TestProducts.WATER.id}'), [])
        self.assertPermissions(
            lambda: self.client.post('/products', self.REQUESTS['POST/products#max']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.delete('/products/1'),
            []
        )

    def test_str(self):
        LOG.debug(TestProducts.WATER)
        self.assertEqual(
            str(TestProducts.WATER),
            f'Product(id=1,name="Water",deprecated=False,price=2.40,category={str(TestCategories.SOFT_DRINKS)})'
        )
