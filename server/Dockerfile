# Stage 1: Build the application
FROM node:23-alpine AS build

WORKDIR /app
COPY ./package*.json ./


RUN npm install --production  # Install only production dependencies

COPY . .

# Stage 2: Create the runtime image
FROM node:22-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app /app

CMD ["npm", "start"]

EXPOSE 5000
