FROM node:24-alpine3.21

WORKDIR /app

# Install nodemon globally
#RUN npm install -g nodemon

COPY package.json package-lock.json .
RUN npm install

COPY . .
RUN npx prisma generate
<<<<<<< HEAD
RUN npm run build
=======

# RUN npx prisma generate
>>>>>>> 4881d38 (fusion serveur osrm)

EXPOSE 3000
CMD ["npm", "run", "start"]
