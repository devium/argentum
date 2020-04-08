import logging

from api.models.discount import Discount
from api.tests.data.discounts import TestDiscounts
from api.tests.data.guests import TestGuests
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class DiscountViewTestCase(CombinedTestCase):
    REFRESH_OBJECTS = [TestDiscounts]

    def test_list(self):
        self.login(TestUsers.BAR_EXT)
        self.perform_list_test('/discounts', TestDiscounts.SAVED)

    def test_list_by_card(self):
        self.login(TestUsers.TERMINAL_EXT)
        roby_discounts = [TestDiscounts.PAID_SOFT_DRINKS]
        self.perform_list_test(f'/discounts?status__guests__card={TestGuests.ROBY.card}', roby_discounts)

    def test_create(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_create_test('/discounts', TestDiscounts)

    def test_update(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_update_test('/discounts', TestDiscounts)

    def test_permissions(self):
        self.perform_permission_test(
            '/discounts',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.BAR_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT],
            update_users=[TestUsers.ADMIN_EXT],
            delete_users=[TestUsers.ADMIN_EXT],
            detail_id=TestDiscounts.PAID_SOFT_DRINKS.id
        )

    def test_str(self):
        LOG.debug(TestDiscounts.PAID_SOFT_DRINKS)
        self.assertEqual(
            str(TestDiscounts.PAID_SOFT_DRINKS),
            f'Discount('
            f'id={TestDiscounts.PAID_SOFT_DRINKS.id},'
            f'status={TestDiscounts.PAID_SOFT_DRINKS.status},'
            f'category={TestDiscounts.PAID_SOFT_DRINKS.category},'
            f'rate=0.10'
            f')'
        )
