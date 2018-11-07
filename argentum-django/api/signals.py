from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType

from api.models import Transaction


def populate_db(sender, **kwargs):
    DEFAULT_USERS = [
        ('admin', 'argentum')
    ]

    DEFAULT_PERMISSIONS = [
        # Note: Django creates basic model view/add/change/delete permissions.
        ('Can view transaction by card', Transaction, 'view_card_transaction')
    ]

    DEFAULT_GROUPS = [
        ('admin', [
            'view_guest',
            'add_guest',
            'change_guest',
            'delete_guest',
            'view_transaction',
            'add_transaction',
            'change_transaction'
        ]),
        ('order', ['view_card_transaction']),
        ('coat_check', ['view_card_transaction']),
        ('check_in', ['view_guest', 'add_guest']),
        ('transfer', ['add_transaction', 'change_transaction']),
        ('scan', ['view_card_transaction'])
    ]

    for username, password in DEFAULT_USERS:
        if not User.objects.filter(username=username):
            User.objects.create_user(username, '', password)

    for name, content_type, codename in DEFAULT_PERMISSIONS:
        if not Permission.objects.filter(codename=codename):
            Permission.objects.create(
                name=name,
                content_type=ContentType.objects.get(model=content_type.__name__.lower()),
                codename=codename
            )

    for group_name, permission_names in DEFAULT_GROUPS:
        if not Group.objects.filter(name=group_name):
            permissions = [
                Permission.objects.get(codename=permission_name).id
                for permission_name in permission_names
            ]
            group = Group.objects.create(name=group_name)
            group.permissions.add(*permissions)

    User.objects.get(username='admin').groups.add(Group.objects.get(name='admin'))
