import logging

from api.models.category import Category
from api.tests.data.categories import SOFT_DRINKS, CATEGORIES
from api.tests.data.users import BAR, ADMIN, WARDROBE, TERMINAL
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class CategoryViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(BAR)

        response = self.client.get('/categories')
        self.assertEqual(response.status_code, 200)
        self.assertPks(response.data, CATEGORIES)

    def test_get_serialize(self):
        self.login(BAR)

        response = self.client.get('/categories')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/categories'])

    def test_post_deserialize(self):
        self.login(ADMIN)

        Category.objects.all().delete()
        response = self.client.post('/categories', self.REQUESTS['POST/categories'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Category.objects.all(), [SOFT_DRINKS])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/categories'),
            [ADMIN, BAR, WARDROBE, TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/categories', self.REQUESTS['POST/categories']),
            [ADMIN]
        )

    def test_str(self):
        LOG.debug(SOFT_DRINKS)
        self.assertEqual(
            str(SOFT_DRINKS),
            'Category(id=1,name="Soft drinks",color="#00ffff")'
        )
