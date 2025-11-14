# Build static assets
FROM node:22-alpine AS build

WORKDIR /app

# Install deps with cache-friendly copy
COPY package*.json ./
RUN npm ci

# Copy sources and build Angular app
COPY . .
RUN npm run build -- --configuration=production

# Serve via nginx
FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# Copy built assets into nginx html directory
COPY --from=build /app/dist/fitness-tracker-frontend/browser .

EXPOSE 80
