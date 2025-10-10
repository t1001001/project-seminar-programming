# build command
# sudo docker build -t amazoncorretto:21 .

# syntax=docker/dockerfile:1
FROM amazoncorretto:21

WORKDIR /app

# Copy the JAR file (/app)
COPY /target/*.jar ./java.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "java.jar"]
