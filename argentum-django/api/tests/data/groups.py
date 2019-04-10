from collections import namedtuple

PlainGroup = namedtuple('PlainGroup', ['id', 'name'])

# These models are created in the initial Django signal, not from this data. These are just for easy handling.
GROUP_ADMIN = PlainGroup(id=1, name='admin')
GROUP_ORDER = PlainGroup(id=2, name='order')
GROUP_COAT_CHECK = PlainGroup(id=3, name='coat_check')
GROUP_CHECK_IN = PlainGroup(id=4, name='check_in')
GROUP_TRANSFER = PlainGroup(id=5, name='transfer')
GROUP_SCAN = PlainGroup(id=6, name='scan')

GROUPS = [GROUP_ADMIN, GROUP_ORDER, GROUP_COAT_CHECK, GROUP_CHECK_IN, GROUP_TRANSFER, GROUP_SCAN]
