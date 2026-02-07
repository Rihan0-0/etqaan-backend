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

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Create a non-root user with home directory
RUN addgroup -g 10014 choreo && \
    adduser -D -u 10014 -G choreo -h /home/choreouser choreouser && \
    mkdir -p /home/choreouser/.npm && \
    chown -R 10014:10014 /home/choreouser

# Copy package files
COPY --chown=10014:10014 package*.json ./

# Switch to non-root user before installing
USER 10014

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and built files as choreouser
COPY --chown=10014:10014 prisma ./prisma/
COPY --from=builder --chown=10014:10014 /app/dist ./dist
COPY --from=builder --chown=10014:10014 /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
