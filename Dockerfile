# On utilise la version 20-alpine3.17 de l'image Node 
FROM node:20-alpine3.17 as node

#On utilise un user n'ayant pas les permissions root 
USER root 

EXPOSE 8080:8080

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

#On lance l'application
CMD ["npm", "start"]
