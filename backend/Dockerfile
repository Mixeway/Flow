## ── Stage 1: Maven build ────────────────────────────────────
FROM maven:3.9.8-amazoncorretto-17 AS maven_build

# Corporate proxy (pass at build: --build-arg HTTP_PROXY=http://host:port)
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV http_proxy=${HTTP_PROXY} \
    https_proxy=${HTTPS_PROXY} \
    HTTP_PROXY=${HTTP_PROXY} \
    HTTPS_PROXY=${HTTPS_PROXY} \
    no_proxy=${NO_PROXY} \
    NO_PROXY=${NO_PROXY}

WORKDIR /app

# RHEL-based image -> use yum (not apt-get)
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
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Maven + Java trust (RHEL path in this stage)
COPY certs.crt /etc/pki/ca-trust/source/anchors/opl-root-ca.crt
COPY settings.xml /root/.m2/settings.xml
RUN update-ca-trust && \
    csplit -s -z -f /tmp/opl-ca- /etc/pki/ca-trust/source/anchors/opl-root-ca.crt '/-----BEGIN CERTIFICATE-----/' '{*}' && \
    for cert in /tmp/opl-ca-*; do \
        keytool -importcert -noprompt -trustcacerts \
            -alias "opl-ca-$(basename "$cert")" \
            -file "$cert" \
            -keystore "${JAVA_HOME}/lib/security/cacerts" \
            -storepass changeit; \
    done && \
    rm -f /tmp/opl-ca-*

# Download dependencies first (cacheable)
COPY pom.xml .
RUN mvn dependency:go-offline -B \
    -Daether.connector.connectTimeout=120000 \
    -Daether.connector.requestTimeout=120000

# Build
COPY src ./src
RUN mvn clean package -DskipTests \
    -Daether.connector.connectTimeout=120000 \
    -Daether.connector.requestTimeout=120000


## ── Stage 2: KICS ───────────────────────────────────────────
FROM checkmarx/kics:latest AS kics


## ── Stage 3: Runtime ────────────────────────────────────────
FROM bitnami/minideb:latest AS final
WORKDIR /app

# Optional proxy support for corporate networks
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV http_proxy=${HTTP_PROXY} \
    https_proxy=${HTTPS_PROXY} \
    HTTP_PROXY=${HTTP_PROXY} \
    HTTPS_PROXY=${HTTPS_PROXY} \
    no_proxy=${NO_PROXY} \
    NO_PROXY=${NO_PROXY}

# Debian-based image -> use apt-get
COPY certs.crt /usr/local/share/ca-certificates/opl-root-ca.crt
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates curl wget unzip git file cron \
      python3 python3-pip libenchant-2-2 && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

# ── JDKs + Gradle ────────────────────────────────────────────
RUN ARCH=$(uname -m) && \
    case "$ARCH" in \
        x86_64)  AJ=x64 ;; \
        aarch64) AJ=aarch64 ;; \
        *) echo "Unsupported architecture: $ARCH"; exit 1 ;; \
    esac && \
    for V in 11 17 21 22 23; do \
        wget --no-check-certificate -O jdk${V}.tar.gz "https://api.adoptium.net/v3/binary/latest/${V}/ga/linux/${AJ}/jdk/hotspot/normal/eclipse" && \
        mkdir -p /usr/local/jdk-${V} && \
        tar -xzf jdk${V}.tar.gz -C /usr/local/jdk-${V} --strip-components=1 && \
        rm jdk${V}.tar.gz; \
    done

ENV JAVA_HOME=/usr/local/jdk-22
ENV PATH="${JAVA_HOME}/bin:${PATH}"

ENV GRADLE_USER_HOME=/root/.gradle
RUN mkdir -p "${GRADLE_USER_HOME}" && \
    printf '%s\n' \
      'org.gradle.java.installations.paths=/usr/local/jdk-11,/usr/local/jdk-17,/usr/local/jdk-21,/usr/local/jdk-22,/usr/local/jdk-23' \
      'org.gradle.java.installations.auto-download=false' \
      > "${GRADLE_USER_HOME}/gradle.properties"

ENV GRADLE_VERSION=8.6
RUN wget --no-check-certificate -q "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" -P /tmp && \
    unzip -q "/tmp/gradle-${GRADLE_VERSION}-bin.zip" -d /opt/gradle && \
    rm "/tmp/gradle-${GRADLE_VERSION}-bin.zip"
ENV GRADLE_HOME=/opt/gradle/gradle-${GRADLE_VERSION}
ENV PATH="${PATH}:${GRADLE_HOME}/bin"

# ── Security tools ───────────────────────────────────────────
RUN npm config set registry https://nexus.opl.tools/repository/npm-proxy/ && \
    npm config set fetch-retries 10 && \
    npm config set fetch-retry-factor 2 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 300000 && \
    npm config set proxy http://126.179.0.206:9090 && \
    npm config set https-proxy http://126.179.0.206:9090 && \
    npm install -g @cyclonedx/cdxgen@latest  --fetch-timeout=300000


# ── Security tools (from local files, no external download) ──
COPY gitleaks_8.12.0_linux_x64.tar.gz /tmp/gitleaks.tar.gz
COPY bearer_2.0.2_linux_amd64.tar.gz /tmp/bearer.tar.gz
COPY grype_0.112.0_linux_amd64.tar.gz /tmp/grype.tar.gz

RUN set -e; \
    gzip -t /tmp/gitleaks.tar.gz; \
    gzip -t /tmp/bearer.tar.gz; \
    gzip -t /tmp/grype.tar.gz; \
    tar -xzf /tmp/gitleaks.tar.gz -C /tmp; \
    tar -xzf /tmp/bearer.tar.gz -C /tmp; \
    tar -xzf /tmp/grype.tar.gz -C /tmp; \
    mv /tmp/gitleaks /usr/local/bin/gitleaks; \
    mv /tmp/bearer /usr/local/bin/bearer; \
    mv /tmp/grype /usr/local/bin/grype; \
    chmod +x /usr/local/bin/gitleaks /usr/local/bin/bearer /usr/local/bin/grype; \
    rm -f /tmp/gitleaks.tar.gz /tmp/bearer.tar.gz /tmp/grype.tar.gz



COPY bearer-rules-0.48.4.tar.gz /tmp/bearer-rules.tar.gz
RUN mkdir -p /opt/bearer && \
    tar -xzf /tmp/bearer-rules.tar.gz -C /opt/bearer --strip-components=1 && \
    rm /tmp/bearer-rules.tar.gz

COPY ZAP_2.16.1_Linux.tar.gz /tmp/ZAP_2.16.1_Linux.tar.gz
RUN tar -xzf /tmp/ZAP_2.16.1_Linux.tar.gz -C /tmp && \
    mv /tmp/ZAP_2.16.1 /opt/zap && \
    rm /tmp/ZAP_2.16.1_Linux.tar.gz


RUN mkdir -p /opt/kics
COPY --from=kics /app/bin/kics /usr/local/bin/kics
COPY --from=kics /app/bin/assets /opt/tools/kics/assets
RUN rm -rf /opt/tools/kics/assets/queries/openAPI && \
    rm -rf /opt/tools/kics/assets/queries/common/passwords_and_secrets

# ── Python deps ──────────────────────────────────────────────
COPY requirements.txt .

RUN pip config set global.index-url https://nexus.opl.tools/repository/pypi-mirror/simple && \
    pip config set global.trusted-host nexus.opl.tools && \
    pip config set global.retries 10 && \
    pip config set global.timeout 120 && \
    pip install --no-cache-dir --break-system-packages -r requirements.txt

# ── App artifacts ────────────────────────────────────────────
COPY --from=maven_build /app/target/MixewayFlowAPI-0.0.1-SNAPSHOT.jar flowapi.jar
COPY gitleaks.default.toml .gitleaks.default.toml
COPY gitleaks.toml .gitleaks.toml
COPY src/main/java/io/mixeway/mixewayflowapi/integrations/scanner/secrets/service/secrets_filtering_service.py .
COPY src/main/java/io/mixeway/mixewayflowapi/integrations/scanner/secrets/service/secrets_verifying_service.py .

# ── Cron cleanup ─────────────────────────────────────────────
RUN echo '#!/bin/bash\nfind /tmp -mmin +39 -type f -exec rm -fv {} \;' > /usr/local/bin/cleanup_tmp.sh && \
    chmod +x /usr/local/bin/cleanup_tmp.sh && \
    echo "*/5 * * * * /usr/local/bin/cleanup_tmp.sh" > /etc/cron.d/cleanup_tmp && \
    chmod 0644 /etc/cron.d/cleanup_tmp && \
    crontab /etc/cron.d/cleanup_tmp

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
