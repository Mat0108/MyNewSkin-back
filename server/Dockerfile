# On utilise la version 20-alpine3.17 de l'image Node 
FROM node:20-alpine3.17 as node

#On utilise un user n'ayant pas les permissions root 
USER node 

EXPOSE 8080:8080

WORKDIR /server

COPY package.json ./
COPY package-lock.json ./

RUN npm config set unsafe-perm true
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

RUN npm install

COPY . .

#On lance l'application
CMD ["npm", "start"]
