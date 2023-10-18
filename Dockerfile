FROM node:18

USER root

EXPOSE 8080

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


CMD ["npm", "start"]