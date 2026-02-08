# Use the official Bun image
FROM oven/bun:1.2-alpine

# Set working directory
WORKDIR /app 

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Run as non-root user for security (bun user already exists in the image)
USER bun

# Start the application
CMD ["bun", "run", "src/index.ts"]
