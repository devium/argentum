from collections import OrderedDict
from typing import List, Type, Iterable

from django.db import models
from django.test import TestCase

from api.tests.data.bonus_transactions import TestBonusTransactions
from api.tests.data.categories import TestCategories
from api.tests.data.config import TestConfig
from api.tests.data.groups import TestGroups
from api.tests.data.guests import TestGuests
from api.tests.data.order_items import TestOrderItems
from api.tests.data.orders import TestOrders
from api.tests.data.product_ranges import TestProductRanges
from api.tests.data.products import TestProducts
from api.tests.data.statuses import TestStatuses
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.test_objects import TestObjects


class PopulatedTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        test_object_groups: Iterable[Type[TestObjects]] = [
            TestUsers,
            TestGroups,
            TestConfig,
            TestGuests,
            TestTransactions,
            TestBonusTransactions,
            TestCategories,
            TestProducts,
            TestProductRanges,
            TestOrders,
            TestOrderItems,
            TestStatuses
        ]

        for test_objects in test_object_groups:
            test_objects.init()
        for test_objects in test_object_groups:
            test_objects.post_init()

    @staticmethod
    def bulk_create_and_refresh(model_class: Type[models.Model], models_: Iterable[models.Model]):
        model_class.objects.bulk_create(models_)
        for model_ in models_:
            model_.refresh_from_db()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.maxDiff = None

    def assertPksEqual(self, http_data: List[OrderedDict], models_: List[models.Model], pk='id', *args, **kwargs):
        self.assertSequenceEqual(
            [obj[pk] for obj in http_data],
            [getattr(model, pk) for model in models_],
            *args,
            **kwargs
        )
