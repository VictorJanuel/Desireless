FROM node:24-alpine3.21

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY . .

# RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]
