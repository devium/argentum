from collections import OrderedDict
from typing import List

from django.contrib.auth.models import User, Group
from django.db import models
from django.test import TestCase

from api.models import Guest, Transaction
from api.models.bonus_transaction import BonusTransaction
from api.tests.data.bonus_transactions import BONUS_TRANSACTIONS
from api.tests.data.guests import GUESTS
from api.tests.data.transactions import TRANSACTIONS
from api.tests.data.users import USERS


class PopulatedTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        for user in USERS:
            if user.username is 'admin':
                continue
            groups = [Group.objects.get(name=group_name).id for group_name in user.groups]
            new_user = User.objects.create_user(user.username, '', user.password)
            new_user.groups.add(*groups)

        Guest.objects.bulk_create(GUESTS)
        Transaction.objects.bulk_create(TRANSACTIONS)
        BonusTransaction.objects.bulk_create(BONUS_TRANSACTIONS)

    def assertPks(self, http_data: OrderedDict, models: List[models.Model], *args, **kwargs):
        self.assertSequenceEqual(
            [obj['id'] for obj in http_data],
            [model.pk for model in models],
            *args,
            **kwargs
        )
