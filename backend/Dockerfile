# Step 1: Use the working Java 17 image
FROM eclipse-temurin:21-jdk-jammy

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy the WAR file from your target folder
# This matches 'backend-0.0.1-SNAPSHOT.war'
COPY target/*.war app.war

# Step 4: Expose the port
EXPOSE 8081

# Step 5: Run the application
# (Spring Boot WAR files can be run exactly like JARs)
ENTRYPOINT ["java", "-jar", "app.war"]