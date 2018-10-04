FROM nginx:alpine

RUN mkdir argentum-ui
WORKDIR argentum-ui

RUN apk add --update nodejs
COPY package.json .
RUN npm install

COPY src src
COPY angular.json .
COPY tsconfig.json .

RUN node_modules/@angular/cli/bin/ng build --aot --prod
RUN mv dist/* /usr/share/nginx/html
RUN rm -rf *

COPY production/nginx.conf /etc/nginx/nginx.conf
COPY production/fullchain.pem /
COPY production/privkey.pem /
