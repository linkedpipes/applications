# Using OpenJDK 8 over alpine as base image
FROM openjdk:8-jdk-alpine

# Tomcat will eventually create directories here
VOLUME /tmp

# Argument specifying the JAR file. Needs to be specified at runtime.
ARG JAR_FILE

# Copy the JAR file in the current directory
COPY ${JAR_FILE} app.jar

# Start the container running the JAR file
# using dev/urandom (refer to https://hackernoon.com/hack-how-to-use-securerandom-with-kubernetes-and-docker-a375945a7b21)
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
