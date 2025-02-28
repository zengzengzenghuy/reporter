FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Ensure the script has execution permissions
RUN chmod +x index.js


# Start the script
CMD ["node", "index.js"]
