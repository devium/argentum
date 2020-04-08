import logging

from api.tests.data.guests import TestGuests
from api.tests.data.tags import TestTags
from api.tests.data.users import TestUsers
from api.tests.utils.combined_test_case import CombinedTestCase

LOG = logging.getLogger(__name__)


class TagViewTestCase(CombinedTestCase):
    def test_list(self):
        self.login(TestUsers.WARDROBE_EXT)
        self.perform_list_test('/tags', TestTags.SAVED)

    def test_list_by_card(self):
        self.login(TestUsers.TERMINAL_EXT)
        self.perform_list_test(f'/tags?guest__card={TestGuests.ROBY.card}', [TestTags.TWO])

    def test_get_by_card_404(self):
        self.login(TestUsers.TERMINAL_EXT)

        response = self.client.get('/tags?guest__card=404')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['guest__card'][0], 'Card not registered.')

    def test_permissions(self):
        self.perform_permission_test(
            '/tags',
            list_users=[TestUsers.ADMIN_EXT, TestUsers.WARDROBE_EXT],
            list_by_card_users=[TestUsers.ADMIN_EXT, TestUsers.WARDROBE_EXT, TestUsers.TERMINAL_EXT],
            retrieve_users=[],
            create_users=[],
            update_users=[],
            delete_users=[],
            card=TestGuests.ROBY.card,
            card_parameter='guest__card',
            detail_id=TestTags.TWO.id,
            detail_404=True
        )

    def test_str(self):
        LOG.debug(TestTags.TWO)
        self.assertEqual(
            str(TestTags.TWO),
            f'Tag(id={TestTags.TWO.id},label=2,guest={TestGuests.ROBY})'
        )
