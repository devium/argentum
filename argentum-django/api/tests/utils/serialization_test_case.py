import json
import os
from typing import List

from django.core.serializers import serialize
from django.db import models
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

    def assertDeserialization(self, models1: List[models.Model], models2: List[models.Model]):
        self.assertEqual(
            serialize('json', models1),
            serialize('json', models2)
        )
