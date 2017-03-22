FROM openjdk:alpine

RUN mkdir argentum-api
WORKDIR argentum-api

COPY build/libs/argentum-*.jar argentum-api.jar
COPY application.yaml .

EXPOSE 8080

CMD ["java", "-jar", "argentum-api.jar"]
