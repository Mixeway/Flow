# Stage 1: Build Angular Application
FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 make g++

# Install dependencies first (cacheable when only source changes)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build -- --configuration production --output-path=dist

# Stage 2: Setup Nginx and SSL
FROM nginx:alpine

RUN apk add --no-cache openssl

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default-https.conf
COPY nginx/nginx-http.conf /etc/nginx/conf.d/default-http.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
