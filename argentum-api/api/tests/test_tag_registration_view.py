import logging

from api.models import TagRegistration, Guest, Tag, Transaction
from api.tests.data.guests import TestGuests
from api.tests.data.labels import TestLabels
from api.tests.data.orders import TestOrders
from api.tests.data.tag_registrations import TestTagRegistrations
from api.tests.data.tags import TestTags
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class TagRegistrationViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.ADMIN_EXT)
        self.perform_list_test('/tag_registrations', TestTagRegistrations.SAVED)

    def test_create_by_card(self):
        self.login(TestUsers.WARDROBE_EXT)
        self.perform_create_test('/tag_registrations', TestTagRegistrations, '#card', '#card', timed=True)

    def test_commit(self):
        self.login(TestUsers.WARDROBE_EXT)
        self.perform_update_test(
            '/tag_registrations',
            TestTagRegistrations,
            '#commit',
            side_effects_objects=[TestTransactions],
            side_effects_objects_filter=dict(order=TestOrders.TAG_REGISTRATION_FOUR),
            timed=True
        )

        roby = Guest.objects.get(id=TestGuests.ROBY.id)
        self.assertEqual(roby.balance, 6.50)

    def test_commit_funds(self):
        self.login(TestUsers.WARDROBE_EXT)
        TestGuests.ROBY.balance = 0.00
        TestGuests.ROBY.save()

        response = self.client.patch(
            f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
            self.REQUESTS[f'PATCH/tag_registrations/#commit']
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'Insufficient funds.')

        self.assertValueEqual(Tag.objects.all(), TestTags.SAVED)

    def test_commit_multi(self):
        self.login(TestUsers.WARDROBE_EXT)
        TestOrders.TAG_REGISTRATION_FOUR.pending = False
        TestOrders.TAG_REGISTRATION_FOUR.save()

        response = self.client.patch(
            f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
            self.REQUESTS[f'PATCH/tag_registrations/#commit']
        )
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(Transaction.objects.all(), TestTransactions.SAVED)
        roby = Guest.objects.get(id=TestGuests.ROBY.id)
        self.assertEqual(roby.balance, 7.50)

    def test_steal(self):
        self.login(TestUsers.WARDROBE_EXT)
        self.perform_create_test('/tag_registrations', TestTagRegistrations, '#steal', '#steal', timed=True)
        TestTagRegistrations.ROBY_THREE_STEAL_COMMITTED.id = TestTagRegistrations.ROBY_THREE_STEAL.id
        self.perform_update_test('/tag_registrations', TestTagRegistrations, '#steal', timed=True)
        self.assertValueEqual(Tag.objects.all(), [TestTags.TWO, TestTags.THREE_STOLEN])

    def test_permissions(self):
        self.perform_permission_test(
            '/tag_registrations',
            list_users=[TestUsers.ADMIN_EXT],
            retrieve_users=[],
            create_users=[TestUsers.ADMIN_EXT, TestUsers.WARDROBE_EXT],
            update_users=[TestUsers.ADMIN_EXT, TestUsers.WARDROBE_EXT],
            delete_users=[],
            detail_id=TestTagRegistrations.ROBY_TWO.id,
            create_suffix='#card',
            update_suffix='#commit'
        )

    def test_str(self):
        LOG.debug(TestTagRegistrations.ROBY_TWO)
        self.assertEqual(
            str(TestTagRegistrations.ROBY_TWO),
            f'TagRegistration('
            f'id={TestTagRegistrations.ROBY_TWO.id},'
            f'time=2019-12-31 22:07:01+00:00,'
            f'labels=[2],'
            f'guest={TestGuests.ROBY},'
            f'order={TestOrders.TAG_REGISTRATION_TWO},'
            f'pending=False'
            f')'
        )
