import logging

from api.models.category import Category
from api.tests.data.categories import TestCategories
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class CategoryViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/categories')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestCategories.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/categories')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/categories'])

    def test_post_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/categories', self.REQUESTS['POST/categories'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Category.objects.all(), TestCategories.ALL + [TestCategories.SPIRITS])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/categories'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(
            lambda: self.client.post('/categories', self.REQUESTS['POST/categories']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.delete('/categories/1'),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestCategories.SOFT_DRINKS)
        self.assertEqual(
            str(TestCategories.SOFT_DRINKS),
            'Category(id=1,name="Soft drinks",color="#00ffff")'
        )
