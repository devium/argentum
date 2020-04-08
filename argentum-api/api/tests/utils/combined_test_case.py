import copy
from typing import List, Type, Dict, Any

from django.db import models
from rest_framework.response import Response

from api.tests.data.users import TestUsers
from api.tests.utils.authenticated_test_case import AuthenticatedTestCase
from api.tests.utils.populated_test_case import PopulatedTestCase
from api.tests.utils.test_objects import TestObjects
from api.tests.utils.utils import to_iso_format


class CombinedTestCase(PopulatedTestCase, AuthenticatedTestCase):
    def perform_list_test(
            self,
            endpoint: str,
            reference_models: List[models.Model],
            pk='id'
    ) -> Response:
        expected_response = copy.deepcopy(self.RESPONSES[f'GET{endpoint}'])

        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.data)
        self.assertPksEqual(response.data, reference_models, pk=pk)
        self.patch_json_ids(expected_response)
        self.assertJSONEqual(response.content, expected_response)

        return response

    def perform_create_test(
            self,
            endpoint: str,
            test_objects: Type[TestObjects],
            request_suffix='',
            response_suffix='',
            reference_status=201,
            side_effects_objects: List[Type[TestObjects]] = None,
            side_effects_objects_filter: Dict[str, any] = None,
            ignore_fields: List[str] = None,
            timed=False,
            fail=False
    ) -> Response:
        self.assertFalse(timed and fail, 'Cannot perform a timed fail test.')

        identifier = f'POST{endpoint}'
        expected_response = copy.deepcopy(self.RESPONSES[identifier + response_suffix])
        request = self.REQUESTS[identifier + request_suffix]

        if fail:
            reference_object = None
        else:
            reference_object = self.ID_MAP[expected_response['id']]

        if timed:
            response, server_time = self.time_constrained(
                lambda: self.client.post(endpoint, request)
            )
            self.assertEqual(response.status_code, reference_status, response.data)
            reference_object.time = server_time
            expected_response['time'] = to_iso_format(server_time)
        else:
            response = self.client.post(endpoint, request)
            self.assertNotIn('time', response.data, 'Response contains time but test is run as non-timed.')
            self.assertEqual(response.status_code, reference_status, response.data)

        queryset = test_objects.MODEL.objects.all()
        if fail:
            self.assertValueEqual(list(queryset), test_objects.SAVED, ignore_fields)
        else:
            # Copy DB-issued ID to the reference object.
            # unresolved_fields = self.find_unresolved_ids(expected_response)
            # self.patch_object(response.data, unresolved_fields)
            self.patch_object_ids(expected_response, response.data)
            # Patch IDs of created objects in expected response. Testing ID references should be available now.
            self.patch_json_ids(expected_response)
            self.assertValueEqual(list(queryset), test_objects.SAVED + [reference_object], ignore_fields)

        self.assertJSONEqual(response.content, expected_response)
        self.check_side_effects(
            reference_object,
            test_objects,
            side_effects_objects,
            side_effects_objects_filter,
            timed
        )

        return response

    def perform_update_test(
            self,
            endpoint: str,
            test_objects: Type[TestObjects],
            suffix='',
            side_effects_objects: List[Type[TestObjects]] = None,
            side_effects_objects_filter: Dict[str, any] = None,
            ignore_fields: List[str] = None,
            timed=False
    ) -> Response:
        # Include trailing / to indicate a detail operation.
        identifier = f'PATCH{endpoint}/{suffix}'
        expected_response = copy.deepcopy(self.RESPONSES[identifier])
        reference_object = self.ID_MAP[expected_response['id']]

        if timed:
            response, server_time = self.time_constrained(
                lambda: self.client.patch(f'{endpoint}/{reference_object.id}', self.REQUESTS[identifier])
            )
            self.assertEqual(response.status_code, 200, response.data)
            reference_object.time = server_time
            expected_response['time'] = to_iso_format(server_time)
        else:
            response = self.client.patch(f'{endpoint}/{reference_object.id}', self.REQUESTS[identifier])
            # Response may contain time from a previous request if the update operation doesn't change the timestamp.
            # Order cancellations for example update the model but not the timestamp.
            self.assertEqual(response.status_code, 200, response.data)

        self.patch_json_ids(expected_response)
        self.assertValueEqual(
            [test_objects.MODEL.objects.get(id=reference_object.id)],
            [reference_object],
            ignore_fields
        )
        self.assertJSONEqual(response.content, expected_response)
        self.check_side_effects(
            reference_object,
            test_objects,
            side_effects_objects,
            side_effects_objects_filter,
            timed
        )

        return response

    def check_side_effects(
            self,
            reference_object: models.Model,
            test_objects: Type[TestObjects],
            side_effects_objects: List[Type[TestObjects]],
            side_effects_objects_filter: Dict[str, any],
            timed=False
    ):
        side_effects_objects = [] if side_effects_objects is None else side_effects_objects
        for side_effects_objects_group in side_effects_objects:
            # Check if any unsaved reference objects in the test group are referencing the created/updated model. Patch
            # and compare them too.
            if side_effects_objects_filter is None:
                related_field = next(
                    field for field in side_effects_objects_group.MODEL._meta.get_fields()
                    if field.related_model == test_objects.MODEL
                )
                created_objects = [
                    obj for obj in side_effects_objects_group.UNSAVED
                    if getattr(obj, related_field.name) == reference_object
                ]
                db_objects = list(
                    side_effects_objects_group.MODEL.objects.filter(**{related_field.name: reference_object})
                )
            else:
                created_objects = [
                    obj for obj in side_effects_objects_group.UNSAVED
                    if all(getattr(obj, key) == value for key, value in side_effects_objects_filter.items())
                ]
                db_objects = list(
                    side_effects_objects_group.MODEL.objects.filter(**side_effects_objects_filter)
                )
            # Match UNSAVED objects with their DB counterparts to fill in their IDs.
            saved_ids = [obj.id for obj in side_effects_objects_group.SAVED]
            new_db_objects = [obj for obj in db_objects if obj.id not in saved_ids]

            self.assertTrue(len(created_objects) > 0, 'No side effect objects found.')
            self.assertEqual(len(created_objects), len(new_db_objects), 'Mismatch between newly created objects.')

            for i in range(len(created_objects)):
                # Patch IDs and, if necessary, time.
                created_objects[i].id = new_db_objects[i].id
                if hasattr(created_objects[i], 'time'):
                    if timed:
                        created_objects[i].time = reference_object.time
                    else:
                        created_objects[i].time = new_db_objects[i].time

            self.update_foreign_ids(created_objects)
            self.assertValueEqual(
                side_effects_objects_group.MODEL.objects.all(),
                side_effects_objects_group.SAVED + created_objects
            )

    def perform_permission_test(
            self,
            endpoint: str,
            list_users: List[TestUsers.UserExt] = None,
            list_by_card_users: List[TestUsers.UserExt] = None,
            retrieve_users: List[TestUsers.UserExt] = None,
            create_users: List[TestUsers.UserExt] = None,
            update_users: List[TestUsers.UserExt] = None,
            delete_users: List[TestUsers.UserExt] = None,
            card: str = '',
            card_parameter: str = '',
            detail_id=-1,
            detail_404=False,
            list_404=False,
            create_suffix='',
            update_suffix=''
    ):
        if list_users is not None:
            if list_404:
                self.assertPermissions(lambda: self.client.get(endpoint), list_users, expected_errors=[404])
            else:
                self.assertPermissions(lambda: self.client.get(endpoint), list_users)

        if list_by_card_users is not None:
            self.assertPermissions(lambda: self.client.get(endpoint, {card_parameter: card}), list_by_card_users)

        if retrieve_users is not None:
            self.assertGreater(detail_id, 0, 'No detail ID specified for retrieve.')
            if detail_404:
                self.assertPermissions(
                    lambda: self.client.get(f'{endpoint}/{detail_id}'),
                    retrieve_users,
                    expected_errors=[404]
                )
            else:
                self.assertPermissions(lambda: self.client.get(f'{endpoint}/{detail_id}'), retrieve_users)

        if create_users is not None:
            identifier = f'POST{endpoint}{create_suffix}'
            request = self.REQUESTS[identifier]
            if list_404:
                self.assertPermissions(lambda: self.client.post(endpoint, request), create_users, expected_errors=[404])
            else:
                self.assertPermissions(lambda: self.client.post(endpoint, request), create_users)

        if update_users is not None:
            identifier = f'PATCH{endpoint}/{update_suffix}'
            request = self.REQUESTS[identifier]
            response = self.RESPONSES.get(identifier)
            obj_id = detail_id if response is None else self.ID_MAP[response['id']].id
            if detail_404:
                self.assertPermissions(
                    lambda: self.client.patch(f'{endpoint}/{obj_id}', request),
                    update_users,
                    expected_errors=[404]
                )
            else:
                self.assertPermissions(lambda: self.client.patch(f'{endpoint}/{obj_id}', request), update_users)

        if delete_users is not None:
            self.assertGreater(detail_id, 0, 'No detail ID specified for delete.')
            if detail_404:
                self.assertPermissions(
                    lambda: self.client.delete(f'{endpoint}/{detail_id}'),
                    delete_users,
                    expected_errors=[404]
                )
            else:
                self.assertPermissions(lambda: self.client.delete(f'{endpoint}/{detail_id}'), delete_users)
