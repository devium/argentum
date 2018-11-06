from django.contrib.auth.models import User, Group, Permission


def populate_db(sender, **kwargs):
    DEFAULT_USERS = [
        ('admin', 'argentum')
    ]

    DEFAULT_GROUPS = [
        ('admin', ['add_guest', 'change_guest', 'delete_guest', 'view_guest']),
        ('order', []),
        ('coat_check', []),
        ('check_in', ['add_guest', 'view_guest']),
        ('transfer', ['add_transaction', 'change_transaction']),
        ('scan', ['view_transaction'])
    ]

    for username, password in DEFAULT_USERS:
        if not User.objects.filter(username=username):
            User.objects.create_user(username, '', password)

    for group_name, permission_names in DEFAULT_GROUPS:
        if not Group.objects.filter(name=group_name):
            permissions = [
                Permission.objects.get(codename=permission_name).id
                for permission_name in permission_names
            ]
            group = Group.objects.create(name=group_name)
            group.permissions.add(*permissions)

    User.objects.get(username='admin').groups.add(Group.objects.get(name='admin'))
