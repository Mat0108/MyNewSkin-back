module.exports = (server,corsConfig) => {
    const blogController = require("../controllers/blogController");
    const cors = require('cors');

    /**
     * @openapi
     * paths:
     *  /blog/set:
     *   post:
     *     tags:
     *       - Blog
     *     description: Permet la création d'un nouveau blog 
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/blog'
     *     responses:
     *       200:
     *         description: Retourne le blog.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/blog'
     *       401:
     *         description: Impossible de créer le blog
     *      
     */
    server.post("/blog/set", cors(corsConfig), blogController.setBlog);
    
    /**
     * @openapi
     * paths:
     *  /blog/:
     *   get:
     *     tags:
     *       - Blog
     *     description: Retourne tous les blogs
     *     responses:
     *       200:
     *         description: Retourne tous les blogs.
     *       401:
     *         description: Impossible de récuperer tous les blogs
     * 
     */
    server.get("/blog/",cors(corsConfig),blogController.getAllBlog);
   
    /**
     * @openapi
     * paths:
     *  /blog/get/id/:blogId:
     *   get:
     *     tags:
     *       - Blog
     *     description: Create a blog
     *     parameters:
     *      - in: params
     *        name: blogId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: get a blog by id.
     */
    server.get("/blog/get/id/:blogId",cors(corsConfig),blogController.getBlog);
   
    /**
     * @openapi
     * paths:
     *  /blog/get/alt/:altId:
     *   get:
     *     tags:
     *       - Blog
     *     description: Create a blog
     *     parameters:
     *      - in: params
     *        name: altId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: get a blog by name.
     */
    server.get("/blog/get/alt/:altId",cors(corsConfig),blogController.getBlogByField);
    
    /**
     * @openapi
     * paths:
     *  /blog/get/search/:searchId:
     *   get:
     *     tags:
     *       - Blog
     *     description: Search a blog
     *     parameters:
     *      - in: params
     *        name: searchId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: search blog.
     */
    server.get("/blog/get/search/:searchId",cors(corsConfig),blogController.searchBlog);
    /**
     * @openapi
     * paths:
     *  /blog/get/:blogId:
     *   delete:
     *     tags:
     *       - Blog
     *     description: delete a blog
     *     parameters:
     *      - in: params
     *        name: searchId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: delete blog.
     */
    server.delete("/blog/get/:blogId",cors(corsConfig),blogController.deleteBlog);
}