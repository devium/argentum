import logging

from api.tests.data.guests import TestGuests
from api.tests.data.orders import TestOrders
from api.tests.data.tag_registrations import TestTagRegistrations
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class TagRegistrationViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
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
