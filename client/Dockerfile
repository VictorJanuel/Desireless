FROM node:24-alpine3.21

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]