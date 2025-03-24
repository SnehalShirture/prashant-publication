# # Use a Node.js base image
# FROM node:20-slim

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (if it exists) to the container
# COPY ./package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application files to the container
# COPY . .

# # Build the app using Vite (you can replace this with your specific build command if different)
# RUN npm run build

# # Expose the port that Vite uses (default: 5173)
# EXPOSE 5173

# # Command to run the Vite development server or start the production build
# CMD ["npm", "run", "dev"]


# for multistage docker image
# Stage 1: Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Minimal Node.js for serving static files
FROM node:20-alpine AS runner

WORKDIR /app

# Install a small static file server (like serve)
RUN npm install -g serve

# Copy only the built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Serve the static build folder
CMD ["serve", "-s", "dist", "-l", "3000"]
