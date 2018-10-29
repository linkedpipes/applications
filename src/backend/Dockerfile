# Using OpenJDK 10
FROM gradle:jdk10 as builder

# Tomcat will eventually create directories here
VOLUME /tmp

# copy files
ADD --chown=gradle . /app
WORKDIR /app

# build the app
RUN gradle unpack

FROM openjdk:10-jre-slim

# Expose port 8080
EXPOSE 8080

COPY --from=builder /app/build/dependency/BOOT-INF/lib /app/lib
COPY --from=builder /app/build/dependency/META-INF /app/META-INF
COPY --from=builder /app/build/dependency/BOOT-INF/classes /app

COPY src/main/resources/com/linkedpipes/lpa/backend/services/base.ttl /app/src/data/rdf/base.ttl

ENTRYPOINT ["java","-cp","app:app/*","com.linkedpipes.lpa.backend.Application"]
