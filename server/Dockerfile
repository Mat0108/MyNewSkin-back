FROM node:21-alpine3.17 as node

USER root

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

EXPOSE 587

CMD ["npm", "start"]