FROM node:14-alpine AS builder

# Create node_modules directory
WORKDIR /app

# Install app dependencies
# This will only run when the package.json is changed
COPY package.json .
RUN npm install

FROM node:14-alpine

# Copy node_modules from previous stage image
RUN mkdir -p /node_modules
COPY --from=builder /app/node_modules /app/node_modules

# Create app directory
WORKDIR /app/backend

# Bundle app source
COPY . .

# Create symlink to /backend/node_modules and start node app
CMD ln -sf /app/node_modules /app/backend/node_modules && npm start
