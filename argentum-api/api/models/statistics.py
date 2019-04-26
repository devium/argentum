from django.db import models
from django.db.models import Sum
from rest_framework import viewsets
from rest_framework import fields
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import Guest, Transaction, Product, ProductRange, Category, OrderItem
from argentum.settings import CURRENCY_CONFIG


class Statistics(models.Model):
    """Dummy class to create permissions."""

    class Meta:
        managed = False


class StatisticsViewSet(viewsets.ViewSet):
    def check_permissions(self, request: Request):
        if not request.user.has_perm('api.view_statistics'):
            self.permission_denied(request)

    def list(self, request: Request):
        body = {
            'guests_total': Guest.objects.count(),
            'guests_checked_in': Guest.objects.filter(checked_in__isnull=False).count(),
            'cards_total': Guest.objects.filter(card__isnull=False).count(),
            'total_positive_balance': Guest.objects.filter(balance__gt=0).aggregate(Sum('balance'))['balance__sum'],
            'total_negative_balance': Guest.objects.filter(balance__lt=0).aggregate(Sum('balance'))['balance__sum'],
            'total_bonus': Guest.objects.aggregate(Sum('bonus'))['bonus__sum'],
            'total_spent': Transaction.objects.filter(
                description='order',
                pending=False
            ).aggregate(Sum('value'))['value__sum'],
            'total_refund': Transaction.objects.filter(
                description='cancel',
                pending=False
            ).aggregate(Sum('value'))['value__sum'],
            'total_deposited': Transaction.objects.filter(
                value__gt=0,
                description='default',
                pending=False
            ).aggregate(Sum('value'))['value__sum'],
            'total_withdrawn': Transaction.objects.filter(
                value__lt=0,
                description='default',
                pending=False
            ).aggregate(Sum('value'))['value__sum'],
            'num_products': Product.objects.filter(deprecated=False).count(),
            'num_legacy_products': Product.objects.filter(deprecated=True).count(),
            'num_product_ranges': ProductRange.objects.count(),
            'num_categories': Category.objects.count(),
            'quantity_sales': [
                {
                    "product": product.id,
                    "quantity": OrderItem.objects.filter(
                        product=product,
                        order__pending=False
                    ).aggregate(Sum('quantity_current'))['quantity_current__sum']
                }
                for product in Product.objects.all()
            ]
        }

        # Set queries that didn't return any results to 0 instead of None.
        for key, value in body.items():
            if value is None:
                body[key] = 0

        # Same for product sales with 0 quantity.
        for sales in body['quantity_sales']:
            if sales['quantity'] is None:
                sales['quantity'] = 0

        # Flip sign on negative transaction sums.
        for key in (
            'total_negative_balance',
            'total_spent',
            'total_withdrawn'
        ):
            body[key] = -body[key]

        # Convert decimal fields to string representation.
        decimal = fields.DecimalField(**CURRENCY_CONFIG)
        for key in (
            'total_positive_balance',
            'total_negative_balance',
            'total_bonus',
            'total_spent',
            'total_refund',
            'total_deposited',
            'total_withdrawn'
        ):
            body[key] = decimal.to_representation(body[key])

        return Response(body)
