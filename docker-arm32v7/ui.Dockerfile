# This Dockerfile does not build the application itself but simply copies the
# distribution files to the nginx directory. Build has to be performed on the
# development system.
FROM arm32v7/nginx

COPY docker-arm32v7/qemu-arm-static /usr/bin/

COPY argentum-ui/production/nginx.conf /etc/nginx/nginx.conf
COPY argentum-ui/dist/ /usr/share/nginx/html/
COPY production/certs/ /certs/
