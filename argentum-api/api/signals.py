from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

from api.models import Guest, Tag
from api.models.config import Config
from api.models.product_range import ProductRange
from api.models.transaction import Transaction
from api.models.bonus_transaction import BonusTransaction


def populate_db(sender, **kwargs):
    if ContentType.objects.count() <= 6:
        raise RuntimeError('Models are missing. Migrate them first.')

    default_users = [
        ('admin', 'argentum'),
    ]

    default_permissions = [
        # Note: Django creates basic model view/add/change/delete permissions.
        ('Can view their own user information', User, 'view_me'),
        ('Can view transaction by card', Transaction, 'view_card_transaction'),
        ('Can view bonus transaction by card', BonusTransaction, 'view_card_bonustransaction'),
        ('Can view orders by card', Transaction, 'view_card_order'),
        ('Can view guests by card', Guest, 'view_card_guest'),
        ('Can view all product ranges', ProductRange, 'view_productrange_all'),
        ('Can view tags by card', Tag, 'view_card_tag')
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
            'view_card_guest',
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
            'view_discount',
            'add_discount',
            'change_discount',
            'delete_discount',
            'view_order',
            'view_card_order',
            'add_order',
            'change_order',
            'change_orderitem',
            'view_status',
            'add_status',
            'change_status',
            'delete_status',
            'view_tag',
            'view_card_tag',
            'view_tagregistration',
            'add_tagregistration',
            'change_tagregistration',
            'view_productrange_all',
            'view_statistics'
        ]),
        ('order', [
            'view_me',
            'view_group',
            'view_config',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_product',
            'view_productrange',
            'view_discount',
            'view_card_order',
            'add_order',
            'change_order',
            'change_orderitem',
            'view_status',
        ]),
        ('coat_check', [
            'view_me',
            'view_group',
            'view_config',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_status',
            'view_tag',
            'view_card_tag',
            'add_tagregistration',
            'change_tagregistration'
        ]),
        ('check_in', [
            'view_me',
            'view_group',
            'view_config',
            'view_guest',
            'view_card_guest',
            'add_guest',
            'change_guest',
            'view_status',
        ]),
        ('transfer', [
            'view_me',
            'view_group',
            'view_config',
            'add_transaction',
            'change_transaction',
            'add_bonustransaction',
            'change_bonustransaction',
            'view_status',
        ]),
        ('scan', [
            'view_me',
            'view_group',
            'view_config',
            'view_card_guest',
            'view_card_transaction',
            'view_card_bonustransaction',
            'view_category',
            'view_product',
            'view_discount',
            'view_card_order',
            'view_status',
            'view_card_tag'
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

    admin = User.objects.get(username='admin')
    for group_name, permission_names in default_groups:
        groups = Group.objects.filter(name=group_name)
        if not groups:
            permissions = [
                Permission.objects.get(codename=permission_name).id
                for permission_name in permission_names
            ]
            group = Group.objects.create(name=group_name)
            group.permissions.add(*permissions)
            admin.groups.add(group)
        else:
            admin.groups.add(groups[0])

    if not Config.objects.filter(key='postpaid_limit'):
        Config.objects.create(key='postpaid_limit', value='0.00')
