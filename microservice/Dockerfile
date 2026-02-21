FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Create shared-media directory if it doesn't exist (it will be mounted)
RUN mkdir -p /shared-media

EXPOSE 4000

CMD ["npm", "start"]
