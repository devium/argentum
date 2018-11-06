from collections import namedtuple

PlainUser = namedtuple('PlainUser', ['username', 'password', 'groups'])

ADMIN = PlainUser(username='admin', password='argentum', groups=['admin'])
BAR = PlainUser(username='bar', password='bar1', groups=['order'])
WARDROBE = PlainUser(username='wardrobe', password='wardrobe1', groups=['coat_check'])
RECEPTION = PlainUser(username='reception', password='reception1', groups=['check_in'])
TOPUP = PlainUser(username='topup', password='topup1', groups=['transfer'])
TERMINAL = PlainUser(username='terminal', password='terminal1', groups=['scan'])

USERS = [ADMIN, BAR, WARDROBE, RECEPTION, TOPUP, TERMINAL]
