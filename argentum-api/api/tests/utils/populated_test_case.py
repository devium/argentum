import datetime
import json
import os
import re
from collections import OrderedDict
from functools import partial
from typing import List, Type, Iterable, Dict, Union, Callable, Any

from django.db import models
from django.db.models import ForeignKey
from django.forms import model_to_dict
from django.test import TestCase
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from rest_framework.response import Response

from api.tests.data.bonus_transactions import TestBonusTransactions
from api.tests.data.categories import TestCategories
from api.tests.data.configs import TestConfigs
from api.tests.data.discounts import TestDiscounts
from api.tests.data.groups import TestGroups
from api.tests.data.guests import TestGuests
from api.tests.data.labels import TestLabels
from api.tests.data.order_items import TestOrderItems
from api.tests.data.orders import TestOrders
from api.tests.data.product_ranges import TestProductRanges
from api.tests.data.products import TestProducts
from api.tests.data.statuses import TestStatuses
from api.tests.data.tag_registrations import TestTagRegistrations
from api.tests.data.tags import TestTags
from api.tests.data.transactions import TestTransactions
from api.tests.data.users import TestUsers
from api.tests.utils.test_objects import TestObjects


class PopulatedTestCase(TestCase):
    ID_MAP: Dict[int, models.Model] = {}
    TEST_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    maxDiff = None

    TEST_OBJECT_GROUPS: Iterable[Type[TestObjects]] = [
        TestConfigs,
        TestCategories,
        TestProducts,
        TestProductRanges,
        TestGroups,
        TestUsers,
        TestStatuses,
        TestGuests,
        TestOrders,
        TestOrderItems,
        TestTransactions,
        TestBonusTransactions,
        TestDiscounts,
        TestTags,
        TestTagRegistrations,
        TestLabels
    ]

    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.ID_MAP.clear()
        for test_objects in cls.TEST_OBJECT_GROUPS:
            test_objects.init()

            # Initialize testing ID map and set all IDs to None.
            for obj in test_objects.SAVED + test_objects.UNSAVED:
                assert obj.id not in cls.ID_MAP, f'Duplicate ID {obj.id}'
                cls.ID_MAP[obj.id] = obj
                obj.id = None

            # Create test objects and set their IDs correctly.
            test_objects.create()

        # Some UNSAVED objects already have an ID because they are patched variations of SAVED objects.
        for id_, obj in cls.ID_MAP.items():
            if id_ % 10 != 0:
                obj.id = cls.ID_MAP[id_ // 10 * 10].id

        cls.TEST_DATA_DIR = os.path.join(cls.TEST_DIR, 'data')
        with open(os.path.join(cls.TEST_DATA_DIR, 'requests.json')) as requests_file:
            cls.REQUESTS = json.load(requests_file)
        with open(os.path.join(cls.TEST_DATA_DIR, 'responses.json')) as responses_file:
            cls.RESPONSES = json.load(responses_file)

            cls.patch_json_ids(cls.REQUESTS)
            # Don't patch responses yet, so we can automatically infer reference objects from their testing IDs.

    @classmethod
    def patch_json_ids(cls, data: Union[Dict, List]):
        dict_sub_data = []
        int_sub_data = []
        str_sub_data = []

        if isinstance(data, List):
            if len(data) == 0:
                return
            if isinstance(data[0], Dict):
                for sub_data in data:
                    cls.patch_json_ids(sub_data)
                return
            if type(data[0]) == int:
                data: List[int] = data
                int_sub_data = [(i, data[i]) for i in range(len(data))]

        elif isinstance(data, Dict):
            data: Dict[str, any] = data
            dict_sub_data = [
                (key, value) for key, value in data.items()
                if isinstance(value, Dict) or isinstance(value, List)
            ]
            int_sub_data = [(key, value) for key, value in data.items() if type(value) == int]
            str_sub_data = [(key, value) for key, value in data.items() if type(value) == str]

        id_sub_data = [(key, value) for key, value in int_sub_data if value > 10000]
        for key, value in id_sub_data:
            obj_id = cls.ID_MAP[value].id
            # Object ID is still None on unsaved objects. We want to keep those ID references for when the object has
            # had its ID patched.
            if obj_id is not None:
                data[key] = obj_id

        for key, value in str_sub_data:
            match = re.search(r'product_range_(\d{5})', value)
            if match is not None:
                obj_id = cls.ID_MAP[int(match[1])].id
                data[key] = f'product_range_{obj_id}'

        for key, value in dict_sub_data:
            cls.patch_json_ids(value)

    @classmethod
    def patch_object_ids(cls, unpatched_expected_response: Union[Dict, List[Dict]], response: Union[Dict, List[Dict]]):
        # The unpatched expected response stores testing IDs referencing all relevant objects changed or created in the
        # request. The actual response holds real DB-issued IDs. They can be transferred by matching them against each
        # other.
        if isinstance(response, List):
            for i in range(len(response)):
                cls.patch_object_ids(unpatched_expected_response[i], response[i])
        elif isinstance(response, Dict):
            for key, value in response.items():
                if key == 'id':
                    # IDs can be safely updated without issuing a DB refresh.
                    cls.ID_MAP[unpatched_expected_response[key]].id = response[key]
                elif isinstance(value, Dict) or isinstance(value, List):
                    cls.patch_object_ids(unpatched_expected_response[key], value)

    @classmethod
    def update_foreign_ids(cls, objects: List[models.Model]):
        # Testing object references are constant throughout all tests but the related objects' IDs may change and are
        # not automatically updated in the owning object. This causes mismatches in field-wise comparison of stored DB
        # objects and reference objects.
        for obj in objects:
            foreign_fields = [field for field in obj._meta.get_fields() if isinstance(field, ForeignKey)]
            for field in foreign_fields:
                # Update the underlying data field directly to avoid a DB refresh of the corresponding reference.
                obj.__dict__[field.attname] = getattr(obj, field.name).id

    def setUp(self):
        # For some reason 'application/json' is not the default content type in the Django client.
        self.client.post = partial(self.client.post, content_type='application/json')
        self.client.put = partial(self.client.put, content_type='application/json')
        self.client.patch = partial(self.client.patch, content_type='application/json')

        super().setUp()

    def assertPksEqual(self, http_data: List[OrderedDict], models_: List[models.Model], pk='id', *args, **kwargs):
        self.assertSequenceEqual(
            [obj[pk] for obj in http_data],
            [getattr(model, pk) for model in models_],
            *args,
            **kwargs
        )

    def assertValueEqual(self, models1: List[models.Model], models2: List[models.Model], ignore_fields=None):
        """
        Compares database-stored models against reference models by field values. Reference models should not be synced
        with the database as that defeats the entire purpose. Many-to-many relations and many-to-one relations owned by
        the related models are not checked by this method, but instead have to be checked manually via their respective
        querysets.
        """
        if ignore_fields is None:
            ignore_fields = []
        models1_dicts = [model_to_dict(model, exclude=ignore_fields) for model in models1]
        models2_dicts = [model_to_dict(model, exclude=ignore_fields) for model in models2]
        self.assertCountEqual(models1_dicts, models2_dicts)

    def assertPatchReadonly(
            self,
            endpoint: str,
            mutable_fields: Dict[str, Any],
            immutable_fields: Dict[str, Any]
    ):
        response = self.client.patch(endpoint, {**mutable_fields, **immutable_fields})
        self.assertEqual(response.status_code, 200)
        for field, value in mutable_fields.items():
            self.assertEqual(
                response.data[field],
                value,
                f'Mutability check failed for field {field}'
            )
        for field, value in immutable_fields.items():
            self.assertNotEqual(
                response.data[field],
                value,
                f'Immutability check failed for field {field}'
            )

    def time_constrained(
            self,
            request: Callable[[], Response],
            time_location: Callable[[Response], Any] = lambda response: parse_datetime(response.data['time'])
    ) -> (Response, datetime.datetime):
        start = timezone.now()
        response = request()
        end = timezone.now()

        server_time = time_location(response)
        self.assertLess(start, server_time)
        self.assertLess(server_time, end)

        return response, server_time
