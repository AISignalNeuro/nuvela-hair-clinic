# Build from the repository root so the seed can read the shared frontend content:
#   docker build -f backend/Dockerfile -t nuvela-api .
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev && npm install --no-save prisma@6.19.0

COPY backend/ backend/
COPY frontend/package.json frontend/package.json
COPY frontend/src/content frontend/src/content
COPY frontend/src/locales frontend/src/locales

WORKDIR /app/backend
RUN npx prisma generate

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
