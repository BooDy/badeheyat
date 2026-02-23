FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
# Copy assets directory specifically
COPY --from=builder /app/src/assets ./assets

# Create shared-media directory
RUN mkdir -p /shared-media

EXPOSE 4000

CMD ["npm", "start"]
