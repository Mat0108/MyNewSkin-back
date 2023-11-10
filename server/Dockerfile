FROM node:latest as node

USER root

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080:8080

EXPOSE 587:587

CMD ["npm", "start"]