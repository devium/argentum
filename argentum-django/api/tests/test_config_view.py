import logging

from api.models.config import Config
from api.tests.data.config import TestConfig
from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.serialization_test_case import SerializationTestCase

LOG = logging.getLogger(__name__)


class ConfigViewTestCase(PopulatedTestCase, SerializationTestCase, AuthenticatedTestCase):
    def test_get(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/config')
        self.assertEqual(response.status_code, 200)
        self.assertPksEqual(response.data, TestConfig.ALL)

    def test_get_serialize(self):
        self.login(TestUsers.BAR)

        response = self.client.get('/config')
        self.assertJSONEqual(response.content, self.RESPONSES['GET/config'])

    def test_patch_deserialize(self):
        self.login(TestUsers.ADMIN)

        response = self.client.patch('/config/1', self.REQUESTS['PATCH/config/1'])
        self.assertEqual(response.status_code, 200)
        self.assertValueEqual(Config.objects.all(), [TestConfig.POSTPAID_LIMIT_PATCHED])

    def test_patch_readonly(self):
        self.login(TestUsers.ADMIN)

        mutable_fields = {
            'value': '-10.00',
        }
        immutable_fields = {
            'key': 'prepaid_limit'
        }

        self.assertPatchReadonly('/config/1', mutable_fields, immutable_fields)

    def test_permissions(self):
        self.assertPermissions(lambda: self.client.get('/config'), TestUsers.ALL)
        self.assertPermissions(lambda: self.client.post('/config', {}), [])
        self.assertPermissions(
            lambda: self.client.patch('/config/1', self.REQUESTS['PATCH/config/1']),
            [TestUsers.ADMIN]
        )

    def test_str(self):
        LOG.debug(TestConfig.POSTPAID_LIMIT)
        self.assertEqual(
            str(TestConfig.POSTPAID_LIMIT),
            'Config(id=1,key="postpaid_limit",value="0.00")'
        )
