# This Dockerfile does not build the application itself but simply copies the
# distribution files to the nginx directory. Build has to be performed on the
# development system.
FROM nginx:alpine

COPY argentum-ui/production/nginx.conf /etc/nginx/nginx.conf
COPY argentum-ui/dist/ /usr/share/nginx/html/
COPY production/certs/ /certs/
