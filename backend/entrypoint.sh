#!/bin/bash

# Debugging statements
echo "SSO variable is: '$SSO'"
echo "SSO lowercased is: '${SSO,,}'"
echo "SAAS variable is: '$SAAS'"
echo "SAAS lowercased is: '${SAAS,,}'"

# Determine the Spring profile based on SSO and SAAS settings
if [ "${SAAS,,}" = "true" ]; then
    # When SAAS is true, use the saas profile
    SPRING_PROFILE="saas"

    # Ensure required environment variables are set when SAAS is enabled
    # Add any SAAS-specific environment variable checks here if needed
elif [ "${SSO,,}" = "true" ]; then
    # When SSO is true (and SAAS is not), ensure required SSO variables are set
    : "${SSO_CLIENT_ID:?SSO_CLIENT_ID is required when SSO is true}"
    : "${SSO_CLIENT_SECRET:?SSO_CLIENT_SECRET is required when SSO is true}"
    : "${SSO_REDIRECT_URI:?SSO_REDIRECT_URI is required when SSO is true}"
    : "${SSO_AUTHORIZATION_URI:?SSO_AUTHORIZATION_URI is required when SSO is true}"
    : "${SSO_TOKEN_URI:?SSO_TOKEN_URI is required when SSO is true}"
    : "${SSO_USER_INFO_URI:?SSO_USER_INFO_URI is required when SSO is true}"
    : "${SSO_JWK_SET_URI:?SSO_JWK_SET_URI is required when SSO is true}"

    # Set the active profile to prodsso
    SPRING_PROFILE="prodsso"
else
    # Set the default profile
    SPRING_PROFILE="prod"
fi

# Start Dependency-Track in the background with 4GB of memory and log output to a file
LOG_FILE="/var/log/dtrack.log"
echo "Starting Dependency-Track..."
if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
    java -Xmx4g -Dhttp.proxyHost=$PROXY_HOST -Dhttp.proxyPort=$PROXY_PORT -Dhttps.proxyHost=$PROXY_HOST -Dhttps.proxyPort=$PROXY_PORT -Dcom.sun.net.ssl.checkRevocation=false -Djavax.net.ssl.trustAll=true -Djavax.net.ssl.trustStore=/dev/null -Djavax.net.ssl.trustAll=true -Djavax.net.ssl.verifyHostname=false -jar /opt/dtrack/dependency-track-bundled.jar >> $LOG_FILE 2>&1 &
else
    java -Xmx4g -jar /opt/dtrack/dependency-track-bundled.jar >> $LOG_FILE 2>&1 &
fi

sleep 30

# Start ZAP daemon
ZAP_LOG_FILE="/var/log/zap.log"
echo "Starting ZAP daemon..."
ZAP_CMD="/opt/zap/zap.sh -daemon -port 32807 -config api.key=12345"

if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
    ZAP_CMD="$ZAP_CMD -config proxy.proxy.host=$PROXY_HOST -config proxy.proxy.port=$PROXY_PORT"
    if [ -n "$NO_PROXY" ]; then
        ZAP_CMD="$ZAP_CMD -config proxy.proxy.skipdomains=$NO_PROXY"
    fi
fi

$ZAP_CMD >> $ZAP_LOG_FILE 2>&1 &

sleep 15


# Configure Maven proxy settings if PROXY_HOST and PROXY_PORT are set
if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
    if [ ! -f /root/.m2/settings.xml ]; then
        echo "Proxy settings detected. Configuring Maven proxy..."
        mkdir -p /root/.m2
        cat <<EOF > /root/.m2/settings.xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <proxies>
    <proxy>
      <active>true</active>
      <protocol>http</protocol>
      <host>${PROXY_HOST}</host>
      <port>${PROXY_PORT}</port>
    </proxy>
  </proxies>
</settings>
EOF
    else
        echo "Maven settings.xml already exists. Skipping proxy configuration."
    fi
fi

# Check if SSL environment variable is set to true
if [ "$(echo $SSL | tr '[:upper:]' '[:lower:]')" = "true" ]; then
    echo "SSL is enabled. Checking for certificates and passwords..."

    # Check if /etc/pki/pass file exists
    if [ -f /etc/pki/pass ]; then
        echo "Password file found. Reading password..."
        P12PASS=$(cat /etc/pki/pass)

        # Check if /etc/pki/certificate.p12 exists and if the password matches
        if [ -f /etc/pki/certificate.p12 ]; then
            echo "Certificate file found. Checking password..."
            if openssl pkcs12 -in /etc/pki/certificate.p12 -nokeys -passin pass:"$P12PASS" >/dev/null 2>&1; then
                echo "Password matches the PKCS12 file."
            else
                echo "Password does not match the PKCS12 file. Exiting..."
                exit 1
            fi
        else
            echo "Certificate file does not exist. Exiting..."
            exit 1
        fi
    elif [ -n "$P12PASS" ]; then
        echo "Password provided via P12PASS environment variable."

        # Check if /etc/pki/certificate.p12 exists and if the password matches
        if [ -f /etc/pki/certificate.p12 ]; then
            echo "Certificate file found. Checking password..."
            if openssl pkcs12 -in /etc/pki/certificate.p12 -nokeys -passin pass:"$P12PASS" >/dev/null 2>&1; then
                echo "Password matches the PKCS12 file."
            else
                echo "Password does not match the PKCS12 file. Exiting..."
                exit 1
            fi
        else
            echo "Certificate file does not exist. Exiting..."
            exit 1
        fi
    else
        echo "No password found. Generating a self-signed certificate and PKCS12 file..."
        mkdir -p /etc/pki
        # Generate a random password
        P12PASS=$(openssl rand -base64 32)

        # Save the password to /etc/pki/pass
        echo "$P12PASS" > /etc/pki/pass

        # Generate a self-signed certificate and PKCS12 file
        openssl req -newkey rsa:4096 -nodes -keyout /etc/pki/private.key -x509 -days 365 -out /etc/pki/certificate.crt -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
        openssl pkcs12 -export -out /etc/pki/certificate.p12 -inkey /etc/pki/private.key -in /etc/pki/certificate.crt -passout pass:"$P12PASS" -name flow

        echo "Self-signed certificate and PKCS12 file created."
    fi

    # Set proxy for git command if both PROXY_HOST and PROXY_PORT are set
    if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
        echo "Setting git proxy to $PROXY_HOST:$PROXY_PORT..."
        git config --global http.proxy http://$PROXY_HOST:$PROXY_PORT
        git config --global https.proxy http://$PROXY_HOST:$PROXY_PORT
    fi

    echo "Proceeding to run the application with SSL and profile $SPRING_PROFILE..."
    if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
        java -Dspring.profiles.active=$SPRING_PROFILE -Dserver.ssl.key-store=/etc/pki/certificate.p12 -Dserver.ssl.key-store-password=$P12PASS -Dserver.ssl.key-alias=flow -Dproxy.host=$PROXY_HOST -Dproxy.port=$PROXY_PORT -jar /app/flowapi.jar
    else
        java -Dspring.profiles.active=$SPRING_PROFILE -Dserver.ssl.key-store=/etc/pki/certificate.p12 -Dserver.ssl.key-store-password=$P12PASS -Dserver.ssl.key-alias=flow -jar /app/flowapi.jar
    fi
else
    echo "SSL is not enabled. Running the application without SSL..."
    if [ -n "$PROXY_HOST" ] && [ -n "$PROXY_PORT" ]; then
        java -Dspring.profiles.active=$SPRING_PROFILE -Dproxy.host=$PROXY_HOST -Dproxy.port=$PROXY_PORT -jar /app/flowapi.jar
    else
        java -Dspring.profiles.active=$SPRING_PROFILE -jar /app/flowapi.jar
    fi
fi
