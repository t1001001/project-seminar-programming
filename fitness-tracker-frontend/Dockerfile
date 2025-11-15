FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
