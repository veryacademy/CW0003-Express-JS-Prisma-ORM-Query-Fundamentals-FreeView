# Use the official Node.js image as a base
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# If package.json does not exist, create it with npm init -y
RUN if [ ! -f package.json ]; then npm init -y; fi

# Install dependencies if package.json exists or was created
RUN npm install express prisma @prisma/client swagger-jsdoc swagger-ui-express swagger-autogen nodemon