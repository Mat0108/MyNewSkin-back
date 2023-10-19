![alt text](https://github.com/Mat0108/PoSkin/blob/master/Front/public/favicon.ico?raw=true)

## Set the .env with the template

To retrieve the mongo connection information, install the Vault cli (vlt) and follow the commands to retrieve the secrets to put in the env file.
```bash
vlt login
vlt config init
vlt secrets get -plaintext MONGODB_USER
vlt secrets get -plaintext MONGODB_PASSWORD
vlt secrets get -plaintext MONGODB_DATABASE


```
## Launch the app
We can easily run the whole with only a single command:
```bash
docker-compose up
```

Docker will pull the MongoDB and Node.js images (if our machine does not have it before).

The services can be run on the background with command:
```bash
docker-compose up -d
```

To access the application :

```bash
site web : http://localhost:3000 
mongo-express : http://localhost:8081
```


## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker-compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker-compose down --rmi all
```

