# Using OpenJDK 11
FROM gradle:5.6.4-jdk11 as builder

# Tomcat will eventually create directories here
VOLUME /tmp

# copy files
COPY --chown=gradle . /app
WORKDIR /app

# build the app
RUN gradle unpack

FROM openjdk:11-jre-slim

# Expose port 8080
EXPOSE 9005
EXPOSE 9092

COPY --from=builder /app/build/dependency/BOOT-INF/lib /app/lib
COPY --from=builder /app/build/dependency/META-INF /app/META-INF
COPY --from=builder /app/build/dependency/BOOT-INF/classes /app

COPY src/main/resources/com/linkedpipes/lpa/backend/services/base.ttl /app/src/data/rdf/base.ttl

ENTRYPOINT ["java","-cp","app:app/lib/*","com.linkedpipes.lpa.backend.Application"]
