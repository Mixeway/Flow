FROM maven:3.9.8-amazoncorretto-17 as maven_build

WORKDIR /app
# Copy the pom.xml and the project files to the container
COPY pom.xml .
COPY src ./src
# Build the application using Maven
RUN mvn clean package -DskipTests
FROM checkmarx/kics:latest as kics


FROM bitnami/minideb:latest as final
WORKDIR /app
# Copy the built JAR file from the previous stage to the container
COPY --from=maven_build /app/target/MixewayFlowAPI-0.0.1-SNAPSHOT.jar flowapi.jar



# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    git \
    && apt-get clean

## Download and install JDK 22
RUN wget -O jdk22.tar.gz https://download.oracle.com/java/22/latest/jdk-22_linux-x64_bin.tar.gz \
    && mkdir -p /usr/local/jdk-22 \
    && tar -xzf jdk22.tar.gz -C /usr/local/jdk-22 --strip-components=1 \
    && rm jdk22.tar.gz

# Set environment variables for Java
ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="$JAVA_HOME/bin:$PATH"

RUN mkdir /opt/kics
RUN mkdir /opt/dtrack
COPY --from=kics /app/bin/kics /usr/local/bin/kics
COPY --from=kics /app/bin/assets /opt/tools/kics/assets

# Setup Dependency-Track
RUN wget https://github.com/DependencyTrack/dependency-track/releases/download/4.11.6/dependency-track-bundled.jar -P /opt/dtrack/

# Setup gitleaks
RUN wget -O gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.12.0/gitleaks_8.12.0_linux_x64.tar.gz && \
    tar -xzf gitleaks.tar.gz && \
    mv gitleaks /usr/local/bin/gitleaks && \
    rm gitleaks.tar.gz

# Install Bearer
RUN wget -O bearer.tar.gz https://github.com/Bearer/bearer/releases/download/v1.46.0/bearer_1.46.0_linux_amd64.tar.gz && \
    tar -xzf bearer.tar.gz && \
    mv bearer /usr/local/bin/bearer && \
    rm bearer.tar.gz \

# Create directory for Bearer rules
RUN mkdir -p /opt/bearer

# Download, extract, and copy bearer-rules
RUN wget -O bearer-rules.tar.gz https://github.com/Bearer/bearer-rules/archive/refs/tags/v0.46.0.tar.gz && \
    tar -xzf bearer-rules.tar.gz -C /opt/bearer --strip-components=1 && \
    rm bearer-rules.tar.gz \

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]


