from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

from api.models.config import Config
from api.models.product_range import ProductRange
from api.models.transaction import Transaction
from api.models.bonus_transaction import BonusTransaction


def populate_db(sender, **kwargs):
    default_users = [
        ('admin', 'argentum'),
    ]

    default_permissions = [
        # Note: Django creates basic model view/add/change/delete permissions.
        ('Can view their own user information', User, 'view_me'),
        ('Can view transaction by card', Transaction, 'view_card_transaction'),
        ('Can view bonus transaction by card', BonusTransaction, 'view_card_bonustransaction'),
        ('Can view orders by card', Transaction, 'view_card_order'),
        ('Can view all product ranges', ProductRange, 'view_productrange_all')
    ]

    default_groups = [
        ('admin', [
            'view_me',
            'view_user',
            'add_user',
            'change_user',
            'delete_user',
            'view_group',
            'view_config',
            'change_config',
            'view_guest',
            'add_guest',
            'change_guest',
            'delete_guest',
            'view_transaction',
            'view_card_transaction',
            'add_transaction',
            'change_transaction',
            'view_bonustransaction',
            'view_card_bonustransaction',
            'add_bonustransaction',
            'change_bonustransaction',
            'view_category',
            'add_category',
            'change_category',
            'delete_category',
            'view_product',
            'add_product',
            'change_product',
            'view_productrange',
            'add_productrange',
            'change_productrange',
            'delete_productrange',
            'view_order',
            'view_card_order',
            'add_order',
            'change_order',
            'view_status',
            'add_status',
            'change_status',
            'delete_status',
            'view_productrange_all'
        ]),
        ('order', [
            'view_me',
            'view_config',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_product',
            'view_productrange',
            'view_card_order',
            'add_order',
            'change_order',
            'view_status',
        ]),
        ('coat_check', [
            'view_me',
            'view_config',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_status',
        ]),
        ('check_in', [
            'view_me',
            'view_config',
            'view_guest',
            'add_guest',
            'change_guest',
            'view_status',
        ]),
        ('transfer', [
            'view_me',
            'view_config',
            'add_transaction',
            'change_transaction',
            'add_bonustransaction',
            'change_bonustransaction',
            'view_status',
        ]),
        ('scan', [
            'view_me',
            'view_config',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_product',
            'view_card_order',
            'view_status',
        ]),
        ('product_range_all', [
            'view_productrange_all'
        ])
    ]

    for username, password in default_users:
        if not User.objects.filter(username=username):
            User.objects.create_user(username, '', password)

    for name, content_type, codename in default_permissions:
        if not Permission.objects.filter(codename=codename):
            Permission.objects.create(
                name=name,
                content_type=ContentType.objects.get(model=content_type.__name__.lower()),
                codename=codename
            )

    for group_name, permission_names in default_groups:
        if not Group.objects.filter(name=group_name):
            permissions = [
                Permission.objects.get(codename=permission_name).id
                for permission_name in permission_names
            ]
            group = Group.objects.create(name=group_name)
            group.permissions.add(*permissions)

    User.objects.get(username='admin').groups.add(Group.objects.get(name='admin'))

    Config.objects.create(key='postpaid_limit', value='0.00')
