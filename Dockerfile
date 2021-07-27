
# PROD CONFIG
FROM node:14.16.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY /.sequelizerc ./
COPY /seeders ./seeders
COPY /migrations ./migrations

CMD ["npm", "run", "start"]