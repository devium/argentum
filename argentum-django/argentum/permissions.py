from typing import List, Dict

from rest_framework.permissions import DjangoModelPermissions


class StrictModelPermissions(DjangoModelPermissions):
    def __init__(self, mods: Dict[str, List[str]]=None):
        self.perms_map = {
            'GET': ['%(app_label)s.view_%(model_name)s'],
            'OPTIONS': [],
            'HEAD': [],
            'POST': ['%(app_label)s.add_%(model_name)s'],
            'PUT': ['%(app_label)s.change_%(model_name)s'],
            'PATCH': ['%(app_label)s.change_%(model_name)s'],
            'DELETE': ['%(app_label)s.delete_%(model_name)s'],
        }
        if mods:
            self.perms_map.update(**mods)
