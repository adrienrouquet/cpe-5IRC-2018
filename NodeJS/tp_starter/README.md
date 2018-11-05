# TP NodeJS step-by-step

**TOUS LES FICHIERS JAVASCRIPT (_*.js_) DOIVENT COMMENCER PAR `'use strict';`**

1. Créer l'arborescence suivante

  ```
    - tp
    |    \
    |    +- public
    |    |
    |    +- app
    |    |    \
    |    |    +- controllers
    |    |    +- models
    |    |    +- routes
    |    |    +- utils
    |    |        \
    |    |        +- utils.js
    |    +- content
    |    +- presentation
    |    +- tests
    |        \
    |        +- content.model.test.js
    |    +- app.js
    |    +- config.json
  ```

2. Initialiser le projet avec npm. Le main de l'application va s'appeler _app.js_.

  ```console
  npm init
  ```

3. Installer express et mocha comme dépendances et les ajouter au fichier package.json

  ```console
  npm install --save express mocha
  ```

4. Modifier le fichier _package.json_ pour rendre privée l'application et ajouter le script de démarrage et le script de test

  ```javascript
  // package.json
  [...]
  "scripts": {
    "test": "mocha ./tests",
    "start": "node app.js"
  },
  "private": true,
  [...]
  ```

5. Créer le fichier _app.js_ et ajouter un `console.log('It Works !')`. Démarrer votre application avec npm.

  ```console
  npm start
  ```

#### Point de validation 1

6. Initialiser express

  ```javascript
  // app.js
  var express = require("express");
  [...]
  var app = express();
  ```

7. Créer le fichier _config.json_ à la racine du projet, et l'alimenter avec le port d'écoute du serveur.

  ```javascript
  // config.json
  {
    "port": 1337
  }
  ```

8. Initialiser votre serveur web en utilisant express et la bibliothèque http de NodeJS. Récupérer le port d'écoute depuis le fichier de configuration _config.json_.

  ```javascript
  // app.js
  var http = require("http");
  var CONFIG = require("./config.json");
  [...]
  // init server
  var server = http.createServer(app);
  server.listen(CONFIG.port);
  ```

  - Pour que la configuration soit accessible par tous les modules pour la suite, déclarer une variable `CONFIG` dans `process.env` et injecter la configuration en JSON "stringifier" comme ceci

  ```javascript
  // app.js
  var CONFIG = require("./config.json");
  process.env.CONFIG = JSON.stringify(CONFIG);
  ```

  - Ainsi, dans les autres modules, l'accès à la configuration sera faite comme cela

  ```javascript
  var CONFIG = JSON.parse(process.env.CONFIG);
  ```

9. Faire en sorte que la route _"/"_ réponde _"It works"_.
  - La "meilleure" façon de faire une route est de créer un router (`express.Router()`) dans un nouveau fichier (_default.route.js_) dans le répertoire _route_. Ce fichier se compose comme ceci:

  ```javascript
  // default.route.js
  var express = require("express");
  var router = express.Router();
  module.exports = router;

  // TODO : Routing using

  router.route(__PATH__)
    .get(function(request, response){...})
    .post(function(request, response){...})
    .put(function(request, response){...})
    .delete(function(request, response){...})
    .all(function(request, response){...})
    .[...]

  ```

  - Dans _app.js_, on importe la nouvelle route et on l'utilise avec `app.use(myRoute)`. On peut également passer comme premier argument le chemin d'accès de la route (`app.use([URI], myRoute)`). Dans ce cas, les chemins indiqués dans le routeur sont alors relatifs.

  ```javascript
  // app.js
  var defaultRoute = require("./app/routes/default.route.js");
  [...]
  app.use(defaultRoute);
  ```

10. Completer l'arborescence.

  ```
  - tp
  |    \
  |    +- public
  |    |    \
  |    |    +- admin
  |    |    |    \
  |    |    |    +- index.html
  |    |    +- watch
  |    |    |    \
  |    |    |    +- index.html
  ```

11. Créer les routes statiques pour les pages _admin_ et _watch_ directement dans _app.js_. Utiliser la méthode `express.static`.

  ```javascript
  // app.js
  var path = require("path");
  [...]
  app.use("/admin", express.static(path.join(__dirname, "public/admin")));
  app.use("/watch", express.static(path.join(__dirname, "public/watch")));
  ```

#### Point de validation 2

12. Mettre à jour le fichier _config.json_ en ajoutant les paramètres suivants:
  - **_contentDirectory_**: chemin d'accès absolu vers le répertoire _content_. Ce répertoire contiendra les fichiers de données et de métadonnées associées à ces fichiers. Les métadonnées seront stockées en JSON.
  - **_presentationDirectory_**: chemin d'accès absolu vers le répertoire _presentation_. Ce répertoire contiendra les métadonnées de présentation au format JSON.

13. Créer les webservices _"/loadPres"_ et _"/savePres"_ dans un nouveau routeur (_presentation.route.js_).

  13.1. Le service "_/loadPres_".
    Ce service doit envoyer la liste de toutes les présentations présentes dans le répertoire _CONFIG.presentationDirectory_.
    Pour ce service, on lit le contenu de tous les fichiers `*.json` de présentation contenus dans _CONFIG.presentationDirectory_, on parse le contenu des fichiers pour extraire les données et on retourne un objet JSON au format "clé-valeur". La clé est l'ID de la présentation et la valeur est l'objet retourné par le parseur JSON.

  ```javascript
  {
    "pres1.id": [Object_Pres1],
    "pres2.id": [Object_Pres2],
    "pres3.id": [Object_Pres3]
    ...
  }
  ```

  13.2. Le service "_/savePres_".
    Pour ce service, on récupère des données au format JSON et on les enregistre dans le répertoire _CONFIG.presentationDirectory_ dans un fichier qui doit s'appeler _[pres.id].pres.json_. L'ID est à récuperer dans les données reçues.

#### Point de validation 3

14. Créer le modele de donnée pour le contenu des slides.
  - Créer le fichier _content.model.js_ dans _app/models/_.
  - Ce fichier va contenir la classe **_ContentModel_** avec la définition suivante:
    - **_attributs_**
      - **type**: public - ['img', 'img_url', 'video', 'web']
      - **id**: public - UUID
      - **title**: public
      - **src**: public - l'URL qui permet d'acceder au contenu
      - **fileName**: public - le nom du fichier stocké dans _[CONFIG.contentDirectory]_ dans le cas d'un contenu de type 'img'.
      Il correspond a l'id du contenu + l'extension qui sera récupérée à partir du fichier original (png, jpeg...).
      - **data**: privé - accessible par getData() et setData()

    - **_méthodes_: /!\ Toutes ces méthodes doivent être statiques**
      - **create(content, callback)**:
      Prend un objet _ContentModel_ en paramètre, stocke le contenu de _[content.data]_ dans le fichier _[content.fileName]_ (dans le cas d'un contenu de type 'img') et stocke les meta-données dans un fichier _[contentModel.id].meta.json_ dans le répertoire _[CONFIG.contentDirectory]_. Les meta-données sont obtenus en faisant un `JSON.parse(content)`
      - **read(id, callback)**:
      Prend un id en paramètre et retourne l'objet _ContentModel_ lu depuis le fichier _[id].meta.json_
      - **update(content, callback)**:
      Prend un objet _ContentModel_ en paramètre et met à jour le fichier de metadata (_[content.id].meta.json_). Le fichier _[content.fileName]_ est mis à jour si _[content.type]_ est égal à 'img' et si _[content.data]_ est renseigné (non nul avec une taille > 0).
      - **delete(id, callback)**:
      Prend un id en paramètre et supprime les fichiers data (_[content.fileName]_) et metadata (_[content.id].meta.json_)

    - **_constructeur_**: Le constructeur prend en paramètre un objet (par exemple un objet JSON provenant du répertoire _CONFIG.content_) et alimente l'objet _ContentModel_ en cours de création avec les données du paramètre. Les données (_data_) ne sont pas alimenter par le constructeur.

  - Lancer les tests unitaires via la commande `npm test`. Les tests unitaires doivent tous être OK et aucun fichier / répertoire créé par les tests ne doit rester à l'issue des tests. 

#### Point de validation 4

15. Créer le router pour exposer les web services REST d'accès au contenu (_content.router.js_).
  **Ce routeur ne comporte pas de métier**, il se contente d'appeler le controleur.
  Ajouter ce router à _app.js_ (comme pour le _default.route.js_).

  > #### Tuto
  >
  > Pour avoir des WS RESTful, on utilise les verbes HTTP (GET, POST, PUT, DELETE) pour déterminer quel action doit être effectuée et les URI doivent permettre d'identifier directement sur quel ressource on doit effectuer l'action.
  > Par exemple, une adresse possible pour accéder à un annuaire est: `http://MyService/users/1`.
  > L'URI est donc de la forme `Protocol://ServiceName/ResourceType/ResourceID`.
  >
  > Le routeur peut s'articuler ainsi pour une ressource `users`:
  >
  > ```javascript
  > // user.route.js
  > "use strict";
  >
  > var express = require("express");
  > var router = express.Router();
  > module.exports = router;
  >
  > var userController = require('./../controllers/user.controllers');
  >
  >    router.route('/users')
  >      .get(userController.list)
  >      .post(userController.create);
  >
  >    router.route('/users/:userId')
  >      .get(userController.read)
  >      .put(userController.update)
  >      .delete(userController.delete);
  >
  >    router.param('userId', function(req, res, next, id) {
  >     req.userId = id;
  >     next();
  >    });
  > ```

  Dans notre cas, le routeur doit fonctionner ainsi:

  - "/contents" + GET => retourne la liste des métadonnées de contenu de slides disponibles sur le serveur (_[content.id].meta.json_)
  - "/contents" + POST => crée un nouveau contenu à partir du formulaire d'ajout de contenu ('file', 'title', 'type', 'src')
  - "/contents/[content.id]" + GET => retourne le contenu avec l'ID correspondant.

  Pour pouvoir gérer l'upload de fichiers sur le serveur (dans le cas d'un POST avec un contenu de type 'img'), on ajoute le module ***multer*** au projet.

  ```javascript
  // content.route.js
  var multer = require("multer");
  var express = require("express");

  var contentController = require('./../controllers/content.controller');

  var router = express.Router();
  module.exports = router;

  var multerMiddleware = multer({ "dest": "/tmp/" });

  router.post("/contents", multerMiddleware.single("file"), contentController.create);
  /**
   * Multer ajoute à l'objet `request` la propriété `file` qui contient plusieurs informations comme:
   *  - request.file.path : le chemin d'acces du fichier sur le serveur
   *  - request.file.originalname : le nom original du fichier
   *  - request.file.mimetype : le type mime
   *  - ...
   */
  ```

#### Point de validation 5

16. Créer le controleur (_content.controller.js_) pour faire le lien entre le routeur et le modèle.
  Le controleur va donc avoir les fonctions suivantes:

  - **list**: liste les fichiers de contenu du répertoire _[CONFIG.contentDirectory]_ et retourne le résultat sous la forme un objet JSON au format "clé-valeur". La clé est l'ID du contenu (_[ContentModel].id_) et la valeur est l'objet _[ContentModel]_ au format JSON.
  ```
  {
    content1.id : content1,
    content2.id : content2,
    ...
  }
  ```
  - **create**: récupère les paramètres de requète pour créer un objet _ContentModel_ et le stocker via la méthode statique du modèle.
  Les paramètres de la requète sont :
    - type : ['img', 'img_url', 'video', 'web']
    - title : le titre du contenu
    - file : le fichier à uploader sur le server dans le cas où le type est 'img'
    - src : la source du contenu dans le cas où le type n'est pas 'img'
  - **read**: Lit le contenu dont l'id est passé en paramètre et:
    - soit retourne les données (_content.getData()_) dans le cas où les données sont hébergées sur le serveur (c'est-à-dire dans le cas où le type de contenu est 'img'). Express permet de faire directement un envoie de fichier avec la méthode `response.sendFile(...)`
    - soit effectue une redirection vers _content.src_ dans le cas où les données ne sont pas stockées sur le serveur.
    - soit retourne les meta-datas (le _content_ au format JSON) si on passe en paramètre `json=true` dans l'URL.

#### Point de validation 6

17. Créer le serveur de websocket et gérer les évènements.
  - Installer la bibliothèque `socket.io` via npm (et l'ajouter au _package.json_). Cette librairie permet de créer des websockets avec NodeJS.
  - Créer un nouveau controleur (_io.controller.js_). Les évènements des websockets seront gérés dans ce controleur. Il expose une fonction _listen(httpServer)_ et prend en paramètre une instance de serveur HTTP de NodeJS.

  ```javascript
  // app.js
  var IOController = require("./app/controllers/io.controller.js");
  [...]
  IOController.listen(server);
  ```

  - Emettre l'évenement "_connection_" sur la nouvelle socket quand une nouvelle connexion est ouverte sur le serveur de websocket

  - Ecouter l'évènement "_data\_comm_" et enregistrer la socket dans une map, avec en clé l'id du client (qui est fourni dans le message).

  - Ecouter l'évenement "_slidEvent_". Le message que nous fourni cet évènemment est un objet JSON qui contient la commande de la présentation et l'id de la présentation

  ```javascript
  {
    "CMD": [START | PAUSE | END | BEGIN | PREV | NEXT ],
    "PRES_ID": [pres.id],
    ...
  }
  ```

  Pour les commandes START, END, BEGIN, PREV et NEXT, on récupère et on envoie les métadonnées du contenu de la slide que l'on doit diffuser à toutes les sockets connectées (penser à passer par _ContentModel_ pour lire les métadonnées).

#### Point de validation 7

18. Gérer les évènements côté clients en utilisant un controleur dédié.
  - Récupérer la bibliothèque _socket.io_ côté client, en insérant la balise HTML suivante:
  ```html
  <script type="text/javascript" src="/socket.io/socket.io.js"></script>
  ```

  - Initialiser la connexion au serveur de websocket dans le controleur et récupérer la socket sur laquelle on doit gérer les évènements.
  ```javascript
  var socket = io.connect();
  ```

  - Ecouter l'évènement _connection_. Lorsqu'il est détecté, émettre l'évènement _data\_com_ avec comme message l'id de la socket. Cet étape doit être faite sur les pages _/admin_ et _/watch_.

  - Côté _/admin_, émettre un évènement _slidEvent_ avec la commande associée (START, END, PAUSE, NEXT...) en fonction des actions sur les boutons de commande de la présentation. Pour la commande START, ne pas oublier d'ajouter le _PRES\_ID_ dans le message JSON.

  - Côté _/watch_, écouter l'évènement _currentSlidEvent_ et mettre à jour l'affichage en utilisant les données reçus.

#### Point de validation 8

19. Créer un nouveau webservice "/login" qui reçoit les informations de connection du front et les transmet au service JavaEE. On pourra soit utiliser directement `http.request` qui est natif à NodeJS, soit se servir du module `request` (`npm install request --save`).

#### Point de validation 9

20. Quelques idées pour aller plus loin...
  - Créer un webservice pour créer les UUID systématiquement côté serveur et supprimer la fonction _generateUUID()_ côté client.

  - Créer un modèle de données pour les présentations et passer les webservices en RESTful.

  - Permettre la diffusion de plusieurs présentation en même temps. Côté admin, en listant les présentations disponibles et en permettant de sélectionner celle que l'on veut diffuser. Côté serveur, en créant des URL de _/watch_ différentes en fonction des présentations diffusées (par exemple, _/watch/[PRES\_ID]_). On pourra utiliser les "rooms" de socket.io pour compartimenter les présentations et pouvoir faire des broadcasts par "room".
