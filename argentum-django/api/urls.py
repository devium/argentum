from django.conf.urls import url
from django.urls import include
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

import api.models.guest
import api.models.transaction

router = routers.DefaultRouter(trailing_slash=False)
router.register('guests', api.models.guest.GuestViewSet)
router.register('transactions', api.models.transaction.TransactionViewSet)

urlpatterns = [
    url('^', include(router.urls)),
    url('^token', tokenviews.obtain_auth_token)
]
