from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        from api.signals import populate_db
        post_migrate.connect(populate_db, sender=self)
