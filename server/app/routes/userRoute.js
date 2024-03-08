module.exports = (server,corsConfig) => {
    const userController = require("../controllers/userController");
    const cors = require('cors');
    const express = require('express');
    const passport = require('passport');
    const router = express.Router();


    /**
     * @openapi
     * paths:
     *  /user/register:
     *   post:
     *     tags:
     *      - User
     *     description: Permet de créer un nouveau utilisateur
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/user'
     *     responses:
     *       200:
     *         description: L'utilisateur a bien été crée.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       401:
     *         description: requête invalide
    */
    server.post("/user/register", cors(corsConfig), userController.userRegister);

    /**
     * @openapi
     * paths:
     *  /user/login:
     *   post:
     *     tags:
     *      - User
     *     description: 
     *     parameters:
     *      - in: body
     *        name: email
     *        schema:
     *          type: string
     *      - in: body
     *        name: password
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: L'utilisateur a bien été connecté
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       500:
     *         description: Utilisateur non trouvé
     *       401:
     *         description: Requête invalide
     */
    server.post("/user/login", cors(corsConfig), userController.userLogin);

    /**
     * @openapi
     * paths:
     *  /user/logout/:userId:
     *   post:
     *     tags:
     *      - User
     *     description: Permet de deconnecter l'utilisateur 
     *     parameters:
     *      - in: params
     *        name: userId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Utilisateur déconnecté
     *       401:
     *         description: Rêquete invalide
     */
    server.post("/user/logout/:userId", cors(corsConfig), userController.userLogout);

    /**
    * @openapi
    * paths:
    *  /users:
    *   get:
    *     tags:
    *      - User
    *     description: Retourne tous les utilisateurs
    *     responses:
    *       200:
    *         description: Retourne tous les utilisateurs.
    *         content:
    *             application/json:
    *                schema:
    *                  $ref: '#components/schema/user'
    *       500:
    *         description: Requête invalide   
    */
    server.get("/users", cors(corsConfig), userController.getAllUsers);

    server.route("/user/:userId")
    .all(cors(corsConfig))

    /**
     * @openapi
     * paths:
     *  /users/:userId:
     *   get:
     *     tags:
     *      - User
     *     description: Retourne l'utilisateur par son id
     *     responses:
     *       200:
     *         description: Retourne l'utilisateur par son id
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       401:
     *         description: Utilisateur non trouvé
     */
    .get(userController.getUserById)



    /**
     * @openapi
     * paths:
     *  /users/:userId:
     *   put:
     *     tags:
     *      - User
     *     description: Permet de modifier un utilisateur
     *     parameters:
     *      - in: params
     *        name: userId
     *        description: Delete user by Id
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: L'utilisateur a bien été modifié.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       500:
     *         description: Requête invalide
     *       404:
     *          description: Utilisateur non trouvé
     *       
     */
    .put(userController.updateUser)



    /**
     * @openapi
     * paths:
     *  /users/:userId:
     *   delete:
     *     tags:
     *      - User
     *     description: Peremt de supprimer un utilisateur
     *     parameters:
     *      - in: params
     *        name: userId
     *        description: Delete user by Id
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: User supprimé
     *       500:
     *         description: Requête invalide
     *       404:
     *          description: Utilisateur non trouvé
     */
    .delete(userController.deleteUser)

    /**
     * @openapi
     * paths:
     *  /users/:userId:
     *   put:
     *     tags:
     *      - User
     *     description: Permet de modifier partiellement un utilisateur
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/user'
     *     responses:
     *       200:
     *         description: L'utilisateur a bien été modifié.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       500:
     *         description: Requête invalide
     *       404:
     *          description: Utilisateur non trouvé
     *       
     */
    .patch(userController.patchUser);

    /**
     * @openapi
     * paths:
     *  /users/forgetpassword:
     *   post:
     *     tags:
     *      - User
     *     description: Permet à un utilisateur de demander un nouveau mot de passe
     *     parameters:
     *      - in: body
     *        name: email
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: E-mail de réinitialisation envoyé avec succes
     *       500:
     *         description: Erreur lors de l'envoi de l'email
     */
    server.post("/users/forgetpassword", cors(corsConfig), userController.demandeReinitialisationMotDePasse);
    
   /**
     * @openapi
     * paths:
     *  /users/validatetoken:
     *   post:
     *     tags:
     *      - User
     *     description: Permet de verifier si le token de réinitialisation du mot de passe est encore valide
     *     parameters:
     *      - in: body
     *        name: resetToken
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Token valide
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/tokenvalide'
     *       202:
     *         description: Token invalide
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/tokeninvalide'
     *                          
     */
    server.post("/users/validatetoken",cors(corsConfig),userController.checkToken);
    
    /**
     * @openapi
     * paths:
     *  /users/editpassword:
     *   post:
     *     tags:
     *      - User
     *     description: Permet à l'utilisateur de réinitialiser son mot de passe
     *     parameters:
     *      - in: body
     *        name: resetToken
     *        schema:
     *          type: string
     *      - in: body
     *        name: newPassword
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: L'utilisateur a bien été modifié.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/user'
     *       500:
     *         description: requête invalide
    */
    server.post("/users/editpassword",cors(corsConfig),userController.reinitialiserMotDePasse)

    /**
     * @openapi
     * paths:
     *  /users/expert:
     *   get:
     *     tags:
     *      - User
     *     description: Permet de retourner tous les experts
     *     responses:
     *       200:
     *         description: Retourne tous les experts
     *       400:
     *         description: Erreur Api
     */
    server.get("/users/expert",cors(corsConfig),userController.getAllExpert)

    /**
     * @openapi
     * paths:
     *  /users/activate/:userId:
     *   get:
     *     tags:
     *      - User
     *     description: Permet de retourner tous les experts
     *     parameters:
     *      - in: params
     *        name: userId
     *        description: Delete user by Id
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne tous les experts
     *       400:
     *         description: Erreur Api
     */
    server.get("/users/activate/:userId",cors(corsConfig),userController.activateAccount)
}

