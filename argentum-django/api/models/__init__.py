from .guest import Guest, GuestViewSet
from .transaction import Transaction, TransactionViewSet

VIEWS = [
    GuestViewSet,
    TransactionViewSet
]