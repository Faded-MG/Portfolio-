# ─────────────────────────────────────────────
# Stage 1 – Install dependencies (build stage)
# ─────────────────────────────────────────────
FROM node:20-alpine AS deps

# Set working directory
WORKDIR /app

# Copy only package manifests first (better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# ─────────────────────────────────────────────
# Stage 2 – Production image
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Set correct ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 3000

# Health check so Docker knows the container is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/status || exit 1

# Start the application
CMD ["node", "src/server.js"]
