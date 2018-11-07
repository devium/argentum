from django.db import models
from django.utils import timezone

CURRENCY_CONFIG = {'max_digits': 9, 'decimal_places': 2}


class Guest(models.Model):
    code = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=64)
    mail = models.CharField(max_length=64)
    status = models.CharField(max_length=32)
    checked_in = models.DateTimeField(default=None, null=True)
    card = models.CharField(default='', max_length=32, unique=True)
    balance = models.DecimalField(default=0, **CURRENCY_CONFIG)
    bonus = models.DecimalField(default=0, **CURRENCY_CONFIG)

    def __str__(self):
        return f'Guest(id={self.id}, name=\'{self.name}\', code=\'{self.code})\''


class Transaction(models.Model):
    time = models.DateTimeField(default=timezone.now)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    value = models.DecimalField(**CURRENCY_CONFIG)
    description = models.CharField(max_length=64)
    pending = models.BooleanField(default=True)

    def __str__(self):
        return f'Transaction(' \
               f'id={self.id}, time={self.time}, guest={self.guest},' \
               f' value={self.value}, description=\'{self.description}\'' \
               f')'
