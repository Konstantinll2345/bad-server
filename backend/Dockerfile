FROM node:22-alpine
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
CMD ["npm", "run", "dev"]