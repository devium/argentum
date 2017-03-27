FROM openjdk:alpine

RUN mkdir argentum-api
WORKDIR argentum-api

COPY build/libs/argentum-*.jar argentum-api.jar
COPY production/application.yaml .
COPY start.sh .

EXPOSE 8080

CMD ["sh", "-e", "start.sh"]
