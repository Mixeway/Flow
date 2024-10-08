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

# Install dependencies, Node.js, Maven, Python, and pip
RUN apt-get update && \
    apt-get install -y curl cron && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y \
        wget \
        unzip \
        git \
        nodejs \
        maven \
        python3 \
        python3-pip \
    && apt-get clean

# Install cdxgen globally
RUN npm install -g @cyclonedx/cdxgen

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    cron \
    unzip \
    git \
    && apt-get clean

## Download and install JDK 22
RUN wget -O jdk22.tar.gz https://download.oracle.com/java/22/latest/jdk-22_linux-x64_bin.tar.gz \
    && mkdir -p /usr/local/jdk-22 \
    && tar -xzf jdk22.tar.gz -C /usr/local/jdk-22 --strip-components=1 \
    && rm jdk22.tar.gz

RUN wget -O jdk17.tar.gz https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz \
    && mkdir -p /usr/local/jdk-17 \
    && tar -xzf jdk17.tar.gz -C /usr/local/jdk-17 --strip-components=1 \
    && rm jdk17.tar.gz

# Set environment variables for Java
ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="$JAVA_HOME/bin:$PATH"

# Install Gradle
ENV GRADLE_VERSION=8.6
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp \
    && unzip /tmp/gradle-${GRADLE_VERSION}-bin.zip -d /opt/gradle \
    && rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV GRADLE_HOME=/opt/gradle/gradle-${GRADLE_VERSION}
ENV PATH="$PATH:$GRADLE_HOME/bin"


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
    rm bearer.tar.gz

# Create directory for Bearer rules
RUN mkdir -p /opt/bearer

# Download, extract, and copy bearer-rules
RUN wget -O bearer-rules.tar.gz https://github.com/Bearer/bearer-rules/archive/refs/tags/v0.46.0.tar.gz && \
    tar -xzf bearer-rules.tar.gz -C /opt/bearer --strip-components=1 && \
    rm bearer-rules.tar.gz

# Create a script to remove old files in /tmp
RUN echo '#!/bin/bash\nfind /tmp -mmin +39 -type f -exec rm -fv {} \;' > /usr/local/bin/cleanup_tmp.sh && chmod +x /usr/local/bin/cleanup_tmp.sh

# Add cron job to execute the cleanup script every 5 minutes
RUN echo "*/5 * * * * /usr/local/bin/cleanup_tmp.sh" > /etc/cron.d/cleanup_tmp

# Give execution rights on the cron job file
RUN chmod 0644 /etc/cron.d/cleanup_tmp

# Apply the cron job and start cron service in the background
RUN crontab /etc/cron.d/cleanup_tmp


# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]


