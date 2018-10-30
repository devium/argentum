from django.db import models


class Guest(models.Model):
    code = models.CharField(max_length=32)
    name = models.CharField(max_length=64)
    mail = models.CharField(max_length=64)
    status = models.CharField(max_length=32)
    checked_in = models.DateTimeField()
    card = models.CharField(max_length=32)
    balance = models.DecimalField(max_digits=9, decimal_places=2)
    bonus = models.DecimalField(max_digits=9, decimal_places=2)

    def __str__(self):
        return f'{self.name} ({self.code})'
