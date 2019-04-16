from typing import Any, Dict

from rest_framework.exceptions import ValidationError

from api.models.guest import Guest


def resolve_card(request_data: Dict[str, Any]):
    card = request_data.get('card')
    if card is not None:
        guests = Guest.objects.filter(card=card)
        if not guests:
            raise ValidationError({'card': ['Card not registered.']})
        request_data['guest'] = guests[0].id
