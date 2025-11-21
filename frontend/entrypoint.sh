#!/bin/sh

SSL_DIR="/etc/nginx/ssl"
PRIVATE_KEY="$SSL_DIR/private.key"
PUBLIC_KEY="$SSL_DIR/public.crt"

# Create the SSL directory if it doesn't exist
mkdir -p $SSL_DIR

# Function to generate SSL keys
generate_keys() {
    echo "Generating new private and public key..."
    openssl req -newkey rsa:4096 -nodes -keyout $PRIVATE_KEY -x509 -days 365 -out $PUBLIC_KEY -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
}


if [ "$(echo $SSL | tr '[:upper:]' '[:lower:]')" = "true" ]; then
    echo "SSL is enabled. Checking for certificates and passwords..."
  # Check if both private and public keys exist
  if [ -f "$PRIVATE_KEY" ] && [ -f "$PUBLIC_KEY" ]; then
      echo "Both private and public keys exist. Verifying if they match..."

      # Extract modulus from both keys and compare
      PRIVATE_MODULUS=$(openssl rsa -noout -modulus -in $PRIVATE_KEY | openssl md5)
      PUBLIC_MODULUS=$(openssl x509 -noout -modulus -in $PUBLIC_KEY | openssl md5)

      if [ "$PRIVATE_MODULUS" != "$PUBLIC_MODULUS" ]; then
          echo "Keys do not match. Generating new keys..."
          generate_keys
      else
          echo "Keys match. Using existing keys."
      fi
  else
      echo "Keys are missing. Generating new keys..."
      generate_keys
  fi
  mv /etc/nginx/conf.d/default-https.conf /etc/nginx/conf.d/default.conf
  rm /etc/nginx/conf.d/default-http.conf
else
  echo "SSL is disabled"
  mv /etc/nginx/conf.d/default-http.conf /etc/nginx/conf.d/default.conf
  rm /etc/nginx/conf.d/default-https.conf
fi

# Start Nginx
echo "Starting Nginx with SSL configuration..."
nginx -g 'daemon off;'
