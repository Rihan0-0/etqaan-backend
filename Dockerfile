# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (no URL needed for generate)
RUN npx prisma generate --no-hints

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Create a non-root user with home directory
RUN addgroup -g 10014 choreo && \
    adduser -D -u 10014 -G choreo -h /home/choreouser choreouser && \
    chown -R 10014:10014 /app && \
    mkdir -p /tmp/.npm && \
    chown -R 10014:10014 /tmp/.npm

# Copy package files
COPY --chown=10014:10014 package*.json ./

# Switch to non-root user
USER 10014

# Set npm cache to writable /tmp directory
ENV npm_config_cache=/tmp/.npm

# Install production dependencies only
RUN npm ci --omit=dev

# Copy Prisma schema and built files
COPY --chown=10014:10014 prisma ./prisma/
COPY --from=builder --chown=10014:10014 /app/dist ./dist
COPY --from=builder --chown=10014:10014 /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Skip migrations in Docker, run them separately or use a migration job
# Just start the application - DATABASE_URL will be read from environment
CMD ["node", "dist/main.js"]
