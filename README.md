![alt text](https://github.com/Mat0108/PoSkin/blob/master/public/images/logobig.png?raw=true)


PO (po-skin.fr) est une application web innovante qui facilite la mise en relation entre des personnes ayant des problèmes de peau mineurs et des experts facialistes. Notre objectif est de fournir une plateforme sécurisée et efficace pour que nos utilisateurs puissent recevoir des conseils professionnels et personnalisés pour le soin de la peau.

**Ce dépôt contient :**
- **API REST :** Le cœur de notre logique métier, gérant les demandes et les réponses entre les utilisateurs et les experts.
- **Base de données :** Tous les modèles de données nécessaires pour stocker les informations utilisateur, les sessions de consultation et plus encore.
- **Authentification et sécurité :** Mécanismes pour protéger les données de nos utilisateurs et assurer des échanges sûrs.

Pour démarrer avec notre backend, veuillez consulter notre documentation pour les détails sur l'installation et la configuration.

Merci de contribuer à améliorer la santé de la peau avec PO !




[![codecov](https://codecov.io/gh/Mat0108/Po-Skin-Back/graph/badge.svg?token=EOQU2XYOQ3)](https://codecov.io/gh/Mat0108/Po-Skin-Back)

## Setup the env file with the template
Demander à un menbre de la team Po. l'url de connection MongoDB
    
## Launch the app
We can easily run the whole with only a single command:

```bash
docker-compose up
```

Docker will pull Node.js images (if our machine does not have it before).

The services can be run on the background with command:
```bash
docker-compose up -d
```

To access the application :

```bash
api : http://localhost:8080
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


## Reload Docker
```bash
.\reload.bat
```

## Deploy
Avec l'acces au compte hub.docker ainsi qu'au compte de l'hebergeur
```bash
.\deploy.bat
```