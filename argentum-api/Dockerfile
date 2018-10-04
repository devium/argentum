FROM openjdk:alpine

RUN mkdir argentum-api
WORKDIR argentum-api

COPY src src
COPY build.gradle .

RUN apk add --update gradle && \
    gradle build && \
    apk del gradle && \
    mv build/libs/argentum-*.jar argentum-api.jar && \
    rm -rf src build.gradle

COPY production/application.yaml .
COPY production/keystore.p12 .
COPY start.sh .

EXPOSE 8443

CMD ["sh", "-e", "start.sh"]
