FROM node:20-alpine3.17 as node

USER root

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]