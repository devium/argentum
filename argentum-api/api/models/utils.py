from typing import Any, Dict

from rest_framework import mixins, status
from rest_framework.exceptions import ValidationError
from rest_framework.request import Request
from rest_framework.response import Response

from api.models.guest import Guest


def resolve_card(request_data: Dict[str, Any]):
    card = request_data.get('card')
    if card is not None:
        guests = Guest.objects.filter(card=card)
        if not guests:
            raise ValidationError({'card': ['Card not registered.']})
        request_data['guest'] = guests[0].id


class ListByCardModelMixin(mixins.ListModelMixin):
    def list(self, request: Request, *args, **kwargs):
        if (
                'guest__card' in request.query_params and
                not Guest.objects.filter(card=request.query_params['guest__card']).exists()
        ):
            return Response({'guest__card': ['Card not registered.']}, status=status.HTTP_404_NOT_FOUND)
        return super().list(request, *args, **kwargs)
