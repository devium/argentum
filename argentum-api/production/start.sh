# To be executed from the argentum-api directory.
python manage.py makemigrations --no-input

echo "Waiting for database."
while ! nc -z $POSTGRES_HOST 5432; do sleep 2; done
echo "Database online. Starting server."

python manage.py migrate --no-input
gunicorn argentum.wsgi:application -c production/gunicorn.conf
