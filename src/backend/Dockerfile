# Using OpenJDK 10
FROM gradle:jdk10 as builder

# Tomcat will eventually create directories here
VOLUME /tmp

# copy files
ADD --chown=gradle . /app
WORKDIR /app

# build the app
RUN gradle build

FROM openjdk:10-jre-slim

# Expose port 8080
EXPOSE 8080

COPY --from=builder /app/build/libs/backend-0.0.1.jar /app/app.jar

COPY src/main/resources/com/linkedpipes/lpa/backend/services/base.ttl /app/src/data/rdf/base.ttl

WORKDIR /app

# Start the container running the JAR file
# using dev/urandom
#(refer to https://hackernoon.com/hack-how-to-use-securerandom-with-kubernetes-and-docker-a375945a7b21)
# Also the --add-modules jdk.incubator.httpclient is needed due to using the HTTP module that is still incubating
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "--add-modules=jdk.incubator.httpclient", "-jar", "app.jar"]
