from django.conf.urls import url
from django.urls import include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('guests', views.GuestViewSet)
router.register('transactions', views.TransactionViewSet)

urlpatterns = [
    url('^', include(router.urls))
]
