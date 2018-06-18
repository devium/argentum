#!/usr/bin/env bash

echo "Waiting for database."
while ! nc -z postgres 5432; do sleep 2; done

echo "Database online. Starting application."
java -jar argentum-api.jar
