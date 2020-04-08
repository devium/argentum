from api.models.config import Config
from api.tests.utils.test_objects import TestObjects


class TestConfigs(TestObjects):
    MODEL = Config

    POSTPAID_LIMIT: MODEL

    POSTPAID_LIMIT_PATCHED: MODEL

    @classmethod
    def init(cls):
        # These models are created in the initial Django signal, not from this data. These are just for easy handling.
        cls.POSTPAID_LIMIT = cls.MODEL(id=10010, key='postpaid_limit', value='0.00')
        cls.SAVED = [cls.POSTPAID_LIMIT]

        cls.POSTPAID_LIMIT_PATCHED = cls.MODEL(id=10011, key='postpaid_limit', value='-10.00')
        cls.UNSAVED = [cls.POSTPAID_LIMIT_PATCHED]

    @classmethod
    def create(cls):
        TestConfigs.POSTPAID_LIMIT.id = Config.objects.get(key=TestConfigs.POSTPAID_LIMIT.key).id
