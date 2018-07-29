# Using OpenJDK 8 over alpine as base image
FROM openjdk:8-jdk-alpine

# Tomcat will eventually create directories here
VOLUME /tmp

# Argument specifying the JAR file. Needs to be specified at runtime
ARG JAR_FILE

# Copy the JAR file in the current directory
COPY ${JAR_FILE} app.jar

# Start the container running the JAR file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]