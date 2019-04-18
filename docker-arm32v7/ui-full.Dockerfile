# This Dockerfile includes the entire build process but is considerably slower
# than building the angular application on the development system.
FROM arm32v7/nginx

COPY docker-arm32v7/qemu-arm-static /usr/bin/

RUN mkdir argentum-ui
WORKDIR argentum-ui

COPY argentum-ui .

RUN \
  apt-get update && \
  apt-get install -y curl make g++ && \
  curl -sL https://deb.nodesource.com/setup_11.x | bash - && \
  apt-get install -y nodejs && \
  npm install && \
  node_modules/@angular/cli/bin/ng build --aot --prod && \
  mv dist/* /usr/share/nginx/html/ && \
  mv production/nginx.conf /etc/nginx.nginx.conf && \
  apt-get purge -y nodejs g++ make curl && \
  apt-get autoremove -y && \
  rm -rf *

COPY production/certs /certs
