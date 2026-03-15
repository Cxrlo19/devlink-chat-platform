# Use Node LTS
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose API port
EXPOSE 4000

# Start dev server
CMD ["npm", "run", "dev"]
