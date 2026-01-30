FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies (reproducible via package-lock.json)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Build Angular app (production)
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

# SPA routing + sensible defaults
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Angular 20 application build output is under dist/<project>/browser
COPY --from=build /app/dist/fitness-tracker-frontend/browser/ ./

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
