from django.conf.urls import url
from django.urls import include
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

import api.models.guest
import api.models.transaction
import api.models.bonus_transaction
import api.models.category
import api.models.product

router = routers.DefaultRouter(trailing_slash=False)
router.register('guests', api.models.guest.GuestViewSet)
router.register('transactions', api.models.transaction.TransactionViewSet)
router.register('bonus_transactions', api.models.bonus_transaction.BonusTransactionViewSet)
router.register('categories', api.models.category.CategoryViewSet)
router.register('products', api.models.product.ProductViewSet)

urlpatterns = [
    url('^', include(router.urls)),
    url('^token', tokenviews.obtain_auth_token)
]
