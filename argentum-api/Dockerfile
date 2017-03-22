FROM openjdk:alpine

COPY build/libs/argentum-*.jar argentum.jar
COPY application.yaml .

EXPOSE 8080

CMD ["java", "-jar", "argentum.jar"]
