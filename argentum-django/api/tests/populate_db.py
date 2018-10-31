from api.models import Guest
from api.tests.guests import GUESTS


def populate_db():
    Guest.objects.bulk_create(GUESTS)
