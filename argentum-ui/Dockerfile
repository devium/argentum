FROM nginx:alpine

RUN mkdir argentum-ui
WORKDIR argentum-ui

COPY package.json .
COPY src src
COPY angular.json .
COPY tsconfig.json .

RUN apk add --update nodejs && \
  npm install && \
  node_modules/@angular/cli/bin/ng build --aot --prod && \
  mv dist/* /usr/share/nginx/html && \
  rm -rf * && \
  apk del nodejs

COPY production/nginx.conf /etc/nginx/nginx.conf
COPY production/fullchain.pem /
COPY production/privkey.pem /
