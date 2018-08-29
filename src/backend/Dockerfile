# Using OpenJDK 10
FROM openjdk:10-jdk

# Tomcat will eventually create directories here
VOLUME /tmp

# Argument specifying the JAR file. Needs to be specified at runtime.
ARG JAR_FILE

# Copy the JAR file in the current directory
COPY ${JAR_FILE} /app/app.jar

# Set working directory
WORKDIR /app

# Expose port 8080
EXPOSE 8080

# Start the container running the JAR file
# using dev/urandom
#(refer to https://hackernoon.com/hack-how-to-use-securerandom-with-kubernetes-and-docker-a375945a7b21)
# Also the --add-modules jdk.incubator.httpclient is needed due to using the HTTP module that is still incubating
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom", "--add-modules=jdk.incubator.httpclient", "-jar", "app.jar"]
