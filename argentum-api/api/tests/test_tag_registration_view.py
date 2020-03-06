import logging

from api.models import TagRegistration, Order, Guest, Tag
from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.data.tag_registrations import TestTagRegistrations
from api.tests.data.tags import TestTags
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase
from api.tests.utils.utils import to_iso_format

LOG = logging.getLogger(__name__)


class TagRegistrationViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.ADMIN)

        response = self.client.get('/tag_registrations')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestTagRegistrations.ALL)
        self.assertJSONEqual(response.content, self.RESPONSES['GET/tag_registrations'])

    def test_post_by_card(self):
        self.login(TestUsers.WARDROBE)
        identifier = 'POST/tag_registrations#card'

        response, server_time = self.time_constrained(
            lambda: self.client.post('/tag_registrations', self.REQUESTS[identifier])
        )
        self.assertEqual(response.status_code, 201)

        TestTagRegistrations.ROBY_FIVE.time = server_time
        self.assertValueEqual(
            TagRegistration.objects.all(),
            TestTagRegistrations.ALL + [TestTagRegistrations.ROBY_FIVE]
        )
        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_commit(self):
        self.login(TestUsers.WARDROBE)
        identifier = f'PATCH/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}#commit'

        response, server_time = self.time_constrained(
            lambda: self.client.patch(
                f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
                self.REQUESTS[identifier]
            )
        )
        self.assertEqual(response.status_code, 200)

        TestTagRegistrations.ROBY_FOUR_COMMITTED.time = server_time
        self.assertValueEqual(
            TagRegistration.objects.all(),
            TestTagRegistrations.ALL[:-1] + [TestTagRegistrations.ROBY_FOUR_COMMITTED]
        )

        order = Order.objects.get(id=TestOrders.TAG_REGISTRATION_FOUR.id)
        self.assertEqual(order.pending, False)

        roby = Guest.objects.get(id=TestGuests.ROBY.id)
        self.assertEqual(roby.balance, 6.50)

        self.assertValueEqual(Tag.objects.all(), TestTags.ALL + [TestTags.FOUR])

        self.RESPONSES[identifier]['time'] = to_iso_format(server_time)
        self.assertJSONEqual(response.content, self.RESPONSES[identifier])

    def test_commit_funds(self):
        self.login(TestUsers.WARDROBE)
        TestGuests.ROBY.balance = 0.00
        TestGuests.ROBY.save()

        response = self.client.patch(
            f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
            self.REQUESTS[f'PATCH/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}#commit']
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['non_field_errors'][0], 'Insufficient funds.')

        self.assertValueEqual(Tag.objects.all(), TestTags.ALL)

    def test_commit_already_paid(self):
        self.login(TestUsers.WARDROBE)
        TestOrders.TAG_REGISTRATION_FOUR.pending = False
        TestOrders.TAG_REGISTRATION_FOUR.save()

        response = self.client.patch(
            f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
            self.REQUESTS[f'PATCH/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}#commit']
        )
        self.assertEqual(response.status_code, 200)
        roby = Guest.objects.get(id=TestGuests.ROBY.id)
        self.assertEqual(roby.balance, 7.50)

    def test_steal(self):
        self.login(TestUsers.WARDROBE)

        response = self.client.post('/tag_registrations', self.REQUESTS['POST/tag_registrations#steal'])
        self.assertEqual(response.status_code, 201)

        response = self.client.patch(
            f'/tag_registrations/{TestTagRegistrations.ROBY_THREE_STEAL.id}',
            self.REQUESTS[f'PATCH/tag_registrations/{TestTagRegistrations.ROBY_THREE_STEAL.id}#steal']
        )
        self.assertEqual(response.status_code, 200)

        self.assertValueEqual(Tag.objects.all(), [TestTags.TWO, TestTags.THREE_STOLEN])

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/tag_registrations'), [TestUsers.ADMIN])
        # Retrieve requests yield a 405 for authorized users because it isn't supported.
        self.assertPermissions(
            lambda: self.client.get(f'/tag_registrations/{TestTagRegistrations.ROBY_TWO.id}'),
            [],
            expected_errors=[403, 405]
        )
        self.assertPermissions(
            lambda: self.client.post('/tag_registrations', self.REQUESTS['POST/tag_registrations#card']),
            [TestUsers.ADMIN, TestUsers.WARDROBE]
        )
        self.assertPermissions(
            lambda: self.client.patch(
                f'/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}',
                self.REQUESTS[f'PATCH/tag_registrations/{TestTagRegistrations.ROBY_FOUR.id}#commit']
            ), [TestUsers.ADMIN, TestUsers.WARDROBE])
        self.assertPermissions(
            lambda: self.client.delete(f'/tag_registrations/{TestTagRegistrations.ROBY_TWO.id}'),
            [],
            expected_errors=[403]
        )

    def test_str(self):
        LOG.debug(TestTagRegistrations.ROBY_TWO)
        self.assertEqual(
            str(TestTagRegistrations.ROBY_TWO),
            f'TagRegistration('
            f'id=1,'
            f'time=2019-12-31 22:07:01+00:00,'
            f'label=2,'
            f'guest={TestGuests.ROBY},'
            f'order={TestOrders.TAG_REGISTRATION_TWO},'
            f'pending=False'
            f')'
        )
