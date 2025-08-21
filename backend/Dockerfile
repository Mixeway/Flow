FROM maven:3.9.8-amazoncorretto-17 as maven_build

WORKDIR /app

# Install architecture detection utilities - using yum for Amazon Linux
RUN yum update -y && yum install -y which file && yum clean all

# Set up Java 22 based on architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        curl -L https://download.oracle.com/java/22/archive/jdk-22_linux-x64_bin.tar.gz -o jdk.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        curl -L https://download.oracle.com/java/22/archive/jdk-22_linux-aarch64_bin.tar.gz -o jdk.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    mkdir -p /usr/local/jdk-22 && \
    tar -xzf jdk.tar.gz -C /usr/local/jdk-22 --strip-components=1 && \
    rm jdk.tar.gz

# Set Java 22 as default for the build
ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="$JAVA_HOME/bin:$PATH"

# Then continue with your maven build
# Copy the pom.xml, requirements.txt and the project files to the container
COPY pom.xml .
COPY requirements.txt .
COPY src ./src
# Build the application using Maven
RUN mvn clean package -DskipTests

FROM checkmarx/kics:latest as kics

FROM bitnami/minideb:latest as final
WORKDIR /app
# Copy the built JAR file from the previous stage to the container
COPY --from=maven_build /app/target/MixewayFlowAPI-0.0.1-SNAPSHOT.jar flowapi.jar

# Install dependencies, Node.js, Maven, Python, pip, and Firefox
RUN apt-get update && \
    apt-get install -y curl cron firefox-esr && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y \
        wget \
        unzip \
        git \
        nodejs \
        maven \
        python3 \
        python3-pip \
        file \
    && apt-get clean

# Install cdxgen globally
RUN npm install -g @cyclonedx/cdxgen

## Download and install JDK 22 based on architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget -O jdk22.tar.gz https://download.oracle.com/java/22/archive/jdk-22_linux-x64_bin.tar.gz; \
        wget -O jdk17.tar.gz https://download.oracle.com/java/17/archive/jdk-17_linux-x64_bin.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget -O jdk22.tar.gz https://download.oracle.com/java/22/archive/jdk-22_linux-aarch64_bin.tar.gz; \
        wget -O jdk17.tar.gz https://download.oracle.com/java/17/archive/jdk-17_linux-aarch64_bin.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    mkdir -p /usr/local/jdk-22 && \
    tar -xzf jdk22.tar.gz -C /usr/local/jdk-22 --strip-components=1 && \
    rm jdk22.tar.gz && \
    mkdir -p /usr/local/jdk-17 && \
    tar -xzf jdk17.tar.gz -C /usr/local/jdk-17 --strip-components=1 && \
    rm jdk17.tar.gz

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

# Install Python dependencies
RUN pip install -r requirements.txt --break-system-packages

# Install ZAP
RUN wget https://github.com/zaproxy/zaproxy/releases/download/v2.16.1/ZAP_2.16.1_Linux.tar.gz && \
    tar -xvf ZAP_2.16.1_Linux.tar.gz && \
    rm ZAP_2.16.1_Linux.tar.gz && \
    mv ZAP_2.16.1 /opt/zap

# Rest of the Dockerfile remains unchanged
RUN mkdir /opt/kics
RUN mkdir /opt/dtrack
COPY --from=kics /app/bin/kics /usr/local/bin/kics
COPY --from=kics /app/bin/assets /opt/tools/kics/assets
RUN rm -rf /opt/tools/kics/assets/queries/openAPI
RUN rm -rf /opt/tools/kics/assets/queries/common/passwords_and_secrets

# Setup Dependency-Track
RUN wget https://github.com/DependencyTrack/dependency-track/releases/download/4.11.6/dependency-track-bundled.jar -P /opt/dtrack/

# Download and install the appropriate gitleaks for the architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget -O gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.12.0/gitleaks_8.12.0_linux_x64.tar.gz; \
        wget -O bearer.tar.gz https://github.com/Bearer/bearer/releases/download/v1.46.0/bearer_1.46.0_linux_amd64.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget -O gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.12.0/gitleaks_8.12.0_linux_arm64.tar.gz; \
        wget -O bearer.tar.gz https://github.com/Bearer/bearer/releases/download/v1.46.0/bearer_1.46.0_linux_arm64.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    tar -xzf gitleaks.tar.gz && \
    mv gitleaks /usr/local/bin/gitleaks && \
    rm gitleaks.tar.gz && \
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
