from api.models.config import Config

# These models are created in the initial Django signal, not from this data. These are just for easy handling.
POSTPAID_LIMIT = Config(id=1, key='postpaid_limit', value='0.00')

CONFIG = [POSTPAID_LIMIT]

# Models below are not stored in the DB, but rather used for POST deserialization testing.

POSTPAID_LIMIT_PATCHED = Config(id=1, key='postpaid_limit', value='-10.00')
