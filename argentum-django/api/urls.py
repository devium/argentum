from django.conf.urls import url
from django.urls import include
from rest_framework import routers
from rest_framework.authtoken import views as tokenviews

from . import views as apiviews

router = routers.DefaultRouter(trailing_slash=False)
router.register('guests', apiviews.GuestViewSet)
router.register('transactions', apiviews.TransactionViewSet)

urlpatterns = [
    url('^', include(router.urls)),
    url('^token', tokenviews.obtain_auth_token)
]
