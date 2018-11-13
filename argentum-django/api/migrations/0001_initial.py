# Generated by Django 2.1.2 on 2018-11-13 15:34

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BonusTransaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('value', models.DecimalField(decimal_places=2, max_digits=9)),
                ('description', models.CharField(max_length=64)),
                ('pending', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=32, unique=True)),
                ('name', models.CharField(max_length=64)),
                ('mail', models.CharField(max_length=64)),
                ('status', models.CharField(max_length=32)),
                ('checked_in', models.DateTimeField(default=None, null=True)),
                ('card', models.CharField(default='', max_length=32, unique=True)),
                ('balance', models.DecimalField(decimal_places=2, default=0, max_digits=9)),
                ('bonus', models.DecimalField(decimal_places=2, default=0, max_digits=9)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('value', models.DecimalField(decimal_places=2, max_digits=9)),
                ('ignore_bonus', models.BooleanField(default=False)),
                ('description', models.CharField(max_length=64)),
                ('pending', models.BooleanField(default=True)),
                ('guest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Guest')),
            ],
        ),
        migrations.AddField(
            model_name='bonustransaction',
            name='guest',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Guest'),
        ),
    ]
