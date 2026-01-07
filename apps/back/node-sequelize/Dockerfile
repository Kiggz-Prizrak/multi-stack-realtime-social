# apps/back/node-sequelize/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY apps/back/node-sequelize/package*.json ./
RUN npm ci

# Copy the rest of the API
COPY apps/back/node-sequelize ./

# API port (ton .env dit 4000)
EXPOSE 4000

# If you use nodemon in dev:
# - add "dev": "nodemon src/index.js" (example) in package.json
CMD ["npm", "run", "dev"]
