#!/usr/bin/env bash

echo "Waiting for database."
while ! nc -z mysql 3306; do sleep 2; done

java -jar argentum-api.jar
