FROM arm32v7/python:3-alpine

COPY docker-arm32v7/qemu-arm-static /usr/bin/

RUN mkdir argentum-api/
WORKDIR argentum-api/

COPY argentum-api/requirements.txt .

RUN \
  apk add --no-cache postgresql-libs && \
  apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
  pip3 install gunicorn --no-cache-dir && \
  pip3 install -r requirements.txt --no-cache-dir && \
  apk --purge del .build-deps

COPY argentum-api/ .
COPY production/certs/ /certs/
RUN mkdir api/migrations/ && touch api/migrations/__init__.py

EXPOSE 8443

CMD ["sh", "-e", "production/start.sh"]
