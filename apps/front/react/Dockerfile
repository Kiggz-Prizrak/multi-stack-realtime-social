FROM node:20-alpine

WORKDIR /app

COPY apps/front/react/package*.json ./
RUN npm ci

COPY apps/front/react ./

EXPOSE ${VITE_PORT}

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${VITE_PORT}"]