# Stage 1: Build Angular Application
FROM node:18-alpine as build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Angular application code
COPY . .

# Build the Angular application with the production environment
RUN npm run build -- --configuration production --output-path=dist

# Stage 2: Setup Nginx and SSL
FROM nginx:alpine

# Install OpenSSL
RUN apk add --no-cache openssl

RUN rm -rf /usr/share/nginx/html/*


# Copy the build output to the Nginx web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Entry point script to handle SSL key generation and verification
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 443 for HTTPS
EXPOSE 443

# Run the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
