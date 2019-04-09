import logging

from api.models.product import Product
from api.tests.data.categories import SOFT_DRINKS
from api.tests.data.products import WATER, PRODUCTS, WATER_MAX, WATER_MIN
from api.tests.data.users import BAR, ADMIN, WARDROBE, TERMINAL
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class ProductViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(BAR)

        response = self.client.get('/products')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, PRODUCTS)

    def test_get_serialize(self):
        self.login(BAR)

        response = self.client.get('/products')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/products'])

    def test_post_deserialize_min(self):
        self.login(ADMIN)

        Product.objects.all().delete()
        response = self.client.post('/products', self.REQUESTS['POST/products#min'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Product.objects.all(), [WATER_MIN])

    def test_post_deserialize_max(self):
        self.login(ADMIN)

        Product.objects.all().delete()

        response = self.client.post('/products', self.REQUESTS['POST/products#max'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Product.objects.all(), [WATER_MAX])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/products'),
            [ADMIN, BAR, WARDROBE, TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/products', self.REQUESTS['POST/products#max']),
            [ADMIN]
        )

    def test_str(self):
        LOG.debug(WATER)
        self.assertEqual(
            str(WATER),
            f'Product(id=1,name="Water",price=2.40,category={str(SOFT_DRINKS)})'
        )
