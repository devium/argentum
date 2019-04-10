import json
import os
from functools import partial
from typing import List, Dict, Any

from django.db import models
from django.forms import model_to_dict
from django.test import TestCase

from argentum.settings import BASE_DIR


class SerializationTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.TEST_DATA_DIR = os.path.join(BASE_DIR, 'api', 'tests', 'data')
        with open(os.path.join(cls.TEST_DATA_DIR, 'responses.json')) as responses_file:
            cls.RESPONSES = json.load(responses_file)
        with open(os.path.join(cls.TEST_DATA_DIR, 'requests.json')) as requests_file:
            cls.REQUESTS = json.load(requests_file)

    def setUp(self):
        # For some reason 'application/json' is not the default content type in the Django client.
        self.client.post = partial(self.client.post, content_type='application/json')
        self.client.put = partial(self.client.put, content_type='application/json')
        self.client.patch = partial(self.client.patch, content_type='application/json')

    def assertValueEqual(self, models1: List[models.Model], models2: List[models.Model], ignore_pks=False):
        models1_dicts = [model_to_dict(model) for model in models1]
        models2_dicts = [model_to_dict(model) for model in models2]
        if ignore_pks:
            for model in (*models1_dicts, *models2_dicts):
                del model['id']
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