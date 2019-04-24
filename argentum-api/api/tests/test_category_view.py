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
        self.assertJSONEqual(response.content, self.RESPONSES['GET/categories'])

    def test_post(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/categories', self.REQUESTS['POST/categories'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Category.objects.all(), TestCategories.ALL + [TestCategories.SPIRITS])
        self.assertJSONEqual(response.content, self.RESPONSES['POST/categories'])

    def test_patch(self):
        self.login(TestUsers.ADMIN)

        response = self.client.patch(
            f'/categories/{TestCategories.SOFT_DRINKS.id}',
            self.REQUESTS[f'PATCH/categories/{TestCategories.SOFT_DRINKS.id}']
        )
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(
            Category.objects.filter(id=TestCategories.SOFT_DRINKS.id),
            [TestCategories.SOFT_DRINKS_PATCHED]
        )
        self.assertJSONEqual(response.content, self.RESPONSES[f'PATCH/categories/{TestCategories.SOFT_DRINKS.id}'])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/categories'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(lambda: self.client.get(f'/categories/{TestCategories.SOFT_DRINKS.id}'), [])
        self.assertPermissions(
            lambda: self.client.post('/categories', self.REQUESTS['POST/categories']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.patch(
                f'/categories/{TestCategories.SOFT_DRINKS.id}',
                self.REQUESTS[f'PATCH/categories/{TestCategories.SOFT_DRINKS.id}']
            ),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.delete(f'/categories/{TestCategories.SOFT_DRINKS.id}'),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestCategories.SOFT_DRINKS)
        self.assertEqual(
            str(TestCategories.SOFT_DRINKS),
            'Category(id=1,name="Soft drinks",color="#00ffff")'
        )
