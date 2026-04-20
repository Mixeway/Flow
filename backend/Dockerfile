## ── Stage 1: Maven build ────────────────────────────────────
FROM maven:3.9.8-amazoncorretto-17 AS maven_build

WORKDIR /app

RUN yum update -y && yum install -y which file && yum clean all

# Set up Java 22 based on architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        curl -L https://download.oracle.com/java/22/archive/jdk-22_linux-x64_bin.tar.gz -o jdk.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        curl -L https://download.oracle.com/java/22/archive/jdk-22_linux-aarch64_bin.tar.gz -o jdk.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; exit 1; \
    fi && \
    mkdir -p /usr/local/jdk-22 && \
    tar -xzf jdk.tar.gz -C /usr/local/jdk-22 --strip-components=1 && \
    rm jdk.tar.gz

ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="$JAVA_HOME/bin:$PATH"

# Download dependencies first (cacheable when only src changes)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

## ── Stage 2: KICS ──────────────────────────────────────────
FROM checkmarx/kics:latest AS kics

## ── Stage 3: Runtime ────────────────────────────────────────
FROM bitnami/minideb:latest AS final
WORKDIR /app

# ── Layer group 1: OS packages (rarely changes) ─────────────
RUN apt-get update && \
    apt-get install -y curl cron firefox-esr wget unzip git python3 python3-pip file libenchant-2-2 maven && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# ── Layer group 2: JDKs + Gradle (rarely changes) ───────────
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget -O jdk22.tar.gz https://download.oracle.com/java/22/archive/jdk-22_linux-x64_bin.tar.gz; \
        wget -O jdk17.tar.gz https://download.oracle.com/java/17/archive/jdk-17_linux-x64_bin.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget -O jdk22.tar.gz https://download.oracle.com/java/22/archive/jdk-22_linux-aarch64_bin.tar.gz; \
        wget -O jdk17.tar.gz https://download.oracle.com/java/17/archive/jdk-17_linux-aarch64_bin.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; exit 1; \
    fi && \
    mkdir -p /usr/local/jdk-22 && tar -xzf jdk22.tar.gz -C /usr/local/jdk-22 --strip-components=1 && rm jdk22.tar.gz && \
    mkdir -p /usr/local/jdk-17 && tar -xzf jdk17.tar.gz -C /usr/local/jdk-17 --strip-components=1 && rm jdk17.tar.gz

ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="$JAVA_HOME/bin:$PATH"

ENV GRADLE_VERSION=8.6
RUN wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp && \
    unzip -q /tmp/gradle-${GRADLE_VERSION}-bin.zip -d /opt/gradle && \
    rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV GRADLE_HOME=/opt/gradle/gradle-${GRADLE_VERSION}
ENV PATH="$PATH:$GRADLE_HOME/bin"

# ── Layer group 3: Security tools (rarely changes) ──────────
RUN npm install -g @cyclonedx/cdxgen@latest

RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget -O gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.12.0/gitleaks_8.12.0_linux_x64.tar.gz; \
        wget -O bearer.tar.gz https://github.com/Bearer/bearer/releases/download/v1.50.2/bearer_1.50.2_linux_amd64.tar.gz; \
        wget -O grype.tar.gz https://github.com/anchore/grype/releases/download/v0.104.2/grype_0.104.2_linux_amd64.tar.gz; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget -O gitleaks.tar.gz https://github.com/gitleaks/gitleaks/releases/download/v8.12.0/gitleaks_8.12.0_linux_arm64.tar.gz; \
        wget -O bearer.tar.gz https://github.com/Bearer/bearer/releases/download/v1.50.2/bearer_1.50.2_linux_arm64.tar.gz; \
        wget -O grype.tar.gz https://github.com/anchore/grype/releases/download/v0.104.2/grype_0.104.2_linux_arm64.tar.gz; \
    else \
        echo "Unsupported architecture: $ARCH"; exit 1; \
    fi && \
    tar -xzf gitleaks.tar.gz && mv gitleaks /usr/local/bin/gitleaks && rm gitleaks.tar.gz && \
    tar -xzf bearer.tar.gz  && mv bearer  /usr/local/bin/bearer  && rm bearer.tar.gz && \
    tar -xzf grype.tar.gz   && mv grype   /usr/local/bin/grype   && rm grype.tar.gz

RUN mkdir -p /opt/bearer && \
    wget -O bearer-rules.tar.gz https://github.com/Bearer/bearer-rules/archive/refs/tags/v0.46.0.tar.gz && \
    tar -xzf bearer-rules.tar.gz -C /opt/bearer --strip-components=1 && \
    rm bearer-rules.tar.gz

RUN wget -q https://github.com/zaproxy/zaproxy/releases/download/v2.16.1/ZAP_2.16.1_Linux.tar.gz && \
    tar -xzf ZAP_2.16.1_Linux.tar.gz && \
    rm ZAP_2.16.1_Linux.tar.gz && \
    mv ZAP_2.16.1 /opt/zap

RUN mkdir /opt/kics
COPY --from=kics /app/bin/kics /usr/local/bin/kics
COPY --from=kics /app/bin/assets /opt/tools/kics/assets
RUN rm -rf /opt/tools/kics/assets/queries/openAPI && \
    rm -rf /opt/tools/kics/assets/queries/common/passwords_and_secrets

# ── Layer group 4: Python deps (changes occasionally) ───────
COPY requirements.txt .
RUN pip install -r requirements.txt --break-system-packages

# ── Layer group 5: App artifacts (changes every build) ──────
COPY --from=maven_build /app/target/MixewayFlowAPI-0.0.1-SNAPSHOT.jar flowapi.jar
COPY gitleaks.default.toml .gitleaks.default.toml
COPY gitleaks.toml .gitleaks.toml
COPY src/main/java/io/mixeway/mixewayflowapi/integrations/scanner/secrets/service/secrets_filtering_service.py .
COPY src/main/java/io/mixeway/mixewayflowapi/integrations/scanner/secrets/service/secrets_verifying_service.py .

# ── Cron cleanup ────────────────────────────────────────────
RUN echo '#!/bin/bash\nfind /tmp -mmin +39 -type f -exec rm -fv {} \;' > /usr/local/bin/cleanup_tmp.sh && \
    chmod +x /usr/local/bin/cleanup_tmp.sh && \
    echo "*/5 * * * * /usr/local/bin/cleanup_tmp.sh" > /etc/cron.d/cleanup_tmp && \
    chmod 0644 /etc/cron.d/cleanup_tmp && \
    crontab /etc/cron.d/cleanup_tmp

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
