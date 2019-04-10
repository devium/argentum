from collections import OrderedDict
from typing import List

from django.db import models
from django.test import TestCase

from api.models.bonus_transaction import BonusTransaction
from api.models.category import Category
from api.models.guest import Guest
from api.models.product import Product
from api.models.status import Status
from api.models.transaction import Transaction
from api.tests.data.bonus_transactions import BONUS_TRANSACTIONS
from api.tests.data.categories import CATEGORIES
from api.tests.data.guests import GUESTS
from api.tests.data.products import PRODUCTS
from api.tests.data.statuses import STATUSES
from api.tests.data.transactions import TRANSACTIONS


class PopulatedTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        Guest.objects.bulk_create(GUESTS)
        Transaction.objects.bulk_create(TRANSACTIONS)
        BonusTransaction.objects.bulk_create(BONUS_TRANSACTIONS)
        Category.objects.bulk_create(CATEGORIES)
        Product.objects.bulk_create(PRODUCTS)
        Status.objects.bulk_create(STATUSES)

    def assertPksEqual(self, http_data: OrderedDict, models_: List[models.Model], *args, **kwargs):
        self.assertSequenceEqual(
            [obj['id'] for obj in http_data],
            [model.pk for model in models_],
            *args,
            **kwargs
        )
