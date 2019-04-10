from api.models.config import Config
from api.tests.utils.test_objects import TestObjects


class TestConfig(TestObjects):
    MODEL = Config
    INIT_DB = False

    # These models are created in the initial Django signal, not from this data. These are just for easy handling.
    POSTPAID_LIMIT = MODEL(id=1, key='postpaid_limit', value='0.00')

    ALL = [POSTPAID_LIMIT]

    # Models below are not stored in the DB, but rather used for POST deserialization testing.

    POSTPAID_LIMIT_PATCHED = MODEL(id=1, key='postpaid_limit', value='-10.00')
