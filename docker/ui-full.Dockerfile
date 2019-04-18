# This Dockerfile includes the entire build process but is considerably slower
# than building the angular application on the development system.
FROM nginx:alpine

RUN mkdir argentum-ui/
WORKDIR argentum-ui/

COPY argentum-ui/ .

RUN \
  apk add --no-cache --virtual .build-deps nodejs nodejs-npm && \
  npm install && \
  node_modules/@angular/cli/bin/ng build --aot --prod && \
  mv dist/* /usr/share/nginx/html && \
  mv production/nginx.conf /etc/nginx.nginx.conf && \
  apk --purge del .build-deps && \
  rm -rf *

COPY production/certs/ /certs/
