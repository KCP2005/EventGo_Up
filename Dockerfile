FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package.json files for all parts of the application
COPY package*.json ./
COPY eventGo/backend/package*.json ./eventGo/backend/
COPY eventGo/frontend/package*.json ./eventGo/frontend/

# Install dependencies
RUN npm run install-all

# Copy the rest of the application
COPY . .

# Build frontend
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose port
EXPOSE 5001

# Start the server
CMD ["npm", "start"] 