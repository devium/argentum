from django.contrib.auth.hashers import PBKDF2PasswordHasher


class BadHasher(PBKDF2PasswordHasher):
    iterations = 1
