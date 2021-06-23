
# PROD CONFIG
FROM node:14.16.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run compile

CMD ["npm", "run", "start"]