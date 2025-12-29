# Dockerfile frontend CHỈ build, không chạy server
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN npm run build

# Stage 2: CHỈ copy files, không chạy Caddy
FROM alpine:latest
RUN mkdir -p /usr/share/caddy
COPY --from=builder /app/dist /usr/share/caddy