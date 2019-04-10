from collections import namedtuple

PlainUser = namedtuple('PlainUser', ['id', 'username', 'password', 'groups'])

ADMIN = PlainUser(id=1, username='admin', password='argentum', groups=['admin'])
BAR = PlainUser(id=2, username='bar', password='bar1', groups=['order'])
WARDROBE = PlainUser(id=3, username='wardrobe', password='wardrobe1', groups=['coat_check'])
RECEPTION = PlainUser(id=4, username='reception', password='reception1', groups=['check_in'])
TOPUP = PlainUser(id=5, username='topup', password='topup1', groups=['transfer'])
TERMINAL = PlainUser(id=6, username='terminal', password='terminal1', groups=['scan'])

USERS = [ADMIN, BAR, WARDROBE, RECEPTION, TOPUP, TERMINAL]

# Models below are not stored in the DB, but rather used for POST deserialization testing.
BUFFET = PlainUser(id=7, username='buffet', password='buffet1', groups=['order'])
WARDROBE_PATCHED = PlainUser(id=3, username='giftshop', password='giftshop1', groups=['order', 'check_in'])
