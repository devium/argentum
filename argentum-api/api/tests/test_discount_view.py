import logging

from api.models.discount import Discount
from api.tests.data.discounts import TestDiscounts
from api.tests.data.guests import TestGuests
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class DiscountViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/discounts')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestDiscounts.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/discounts'])

    def test_get_by_card(self):
        self.login(TestUsers.TERMINAL)

        response = self.client.get(f'/discounts?status__guests__card={TestGuests.ROBY.card}')
        self.assertJSONEqual(
            response.content,
            self.RESPONSES[f'GET/discounts?status__guests__card={TestGuests.ROBY.card}']
        )

    def test_post(self):
        self.login(TestUsers.ADMIN)

        response = self.client.post('/discounts', self.REQUESTS['POST/discounts'])
        self.assertEqual(response.status_code, 201)
        self.assertValueEqual(Discount.objects.all(), TestDiscounts.ALL + [TestDiscounts.PENDING_SOFT_DRINKS])
        self.assertJSONEqual(response.content, self.RESPONSES['POST/discounts'])

    def test_patch(self):
        self.login(TestUsers.ADMIN)

        response = self.client.patch(
            f'/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}',
            self.REQUESTS[f'PATCH/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}']
        )
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(
            Discount.objects.filter(id=TestDiscounts.PAID_SOFT_DRINKS.id),
            [TestDiscounts.PAID_SOFT_DRINKS_PATCHED]
        )
        self.assertJSONEqual(response.content, self.RESPONSES[f'PATCH/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}'])

    def test_permissions(self):
        self.assertPermissions(
            lambda: self.client.get('/discounts'),
            [TestUsers.ADMIN, TestUsers.BAR, TestUsers.WARDROBE, TestUsers.TERMINAL]
        )
        self.assertPermissions(lambda: self.client.get(f'/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}'), [])
        self.assertPermissions(
            lambda: self.client.post('/discounts', self.REQUESTS['POST/discounts']),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.patch(
                f'/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}',
                self.REQUESTS[f'PATCH/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}']
            ),
            [TestUsers.ADMIN]
        )
        self.assertPermissions(
            lambda: self.client.delete(f'/discounts/{TestDiscounts.PAID_SOFT_DRINKS.id}'),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestDiscounts.PAID_SOFT_DRINKS)
        self.assertEqual(
            str(TestDiscounts.PAID_SOFT_DRINKS),
            f'Discount('
            f'id=1,'
            f'status={TestDiscounts.PAID_SOFT_DRINKS.status},'
            f'category={TestDiscounts.PAID_SOFT_DRINKS.category},'
            f'rate=0.10'
            f')'
        )
