# ---------- Build & runtime image for Next.js + Prisma ----------
FROM node:20-alpine

# ✅ Install OpenSSL 1.1 compatibility so Prisma can load libssl.so.1.1
RUN apk add --no-cache openssl1.1-compat

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy the rest of the source code
COPY . .

# Environment for build
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
