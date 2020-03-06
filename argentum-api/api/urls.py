from django.conf.urls import url
from django.urls import include
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

from api.models.config import ConfigViewSet
from api.models.discount import DiscountViewSet
from api.models.order import OrderViewSet
from api.models.order_item import OrderItemViewSet
from api.models.product_range import ProductRangeViewSet
from api.models.statistics import StatisticsViewSet
from api.models.tag import TagViewSet
from api.models.tag_registration import TagRegistrationViewSet
from api.models.user import UserViewSet
from api.models.group import GroupViewSet
from api.models.bonus_transaction import BonusTransactionViewSet
from api.models.category import CategoryViewSet
from api.models.guest import GuestViewSet
from api.models.product import ProductViewSet
from api.models.status import StatusViewSet
from api.models.transaction import TransactionViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('users', UserViewSet)
router.register('groups', GroupViewSet)
router.register('config', ConfigViewSet)
router.register('guests', GuestViewSet)
router.register('transactions', TransactionViewSet)
router.register('bonus_transactions', BonusTransactionViewSet)
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)
router.register('product_ranges', ProductRangeViewSet)
router.register('discounts', DiscountViewSet)
router.register('orders', OrderViewSet)
router.register('order_items', OrderItemViewSet)
router.register('statuses', StatusViewSet)
router.register('tags', TagViewSet)
router.register('tag_registrations', TagRegistrationViewSet)
router.register('statistics', StatisticsViewSet, basename='statistics')

urlpatterns = [
    url('^', include(router.urls)),
    url('^token', tokenviews.obtain_auth_token)
]
