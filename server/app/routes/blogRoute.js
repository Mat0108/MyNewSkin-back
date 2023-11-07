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
     *     description: Create a rdv
     *     parameters:
     *      - in: body
     *        name: title
     *        schema:
     *          type: string
     *      - in: body
     *        name: imagepresentation
     *        schema:
     *          type: string
     *      - in: body
     *        name: altimagepresentation
     *        schema:
     *          type: string
     *      - in: body
     *        name: textpresentation
     *        schema:
     *          type: string
     *      - in: body
     *        name: titlelist
     *        schema:
     *          type: array
     *          items:
     *            - type:string 
     *      - in: body
     *        name: textlist
     *        schema:
     *          type: array
     *          items:
     *            - type:string 
     *      - in: body
     *        name: imagelist
     *        schema:
     *          type: array
     *          items:
     *            - type:string 
     *      - in: body
     *        name: altimage
     *        schema:
     *          type: array
     *          items:
     *            - type:string
     *      - in: body
     *        name: textcolor
     *        schema:
     *          type: array
     *          items:
     *            - type:string  
     *      - in: body
     *        name: layout
     *        schema:
     *          type: array
     *          items:
     *            - type:string 
     *      - in: body
     *        name: margin
     *        schema:
     *          type: string 
     *     responses:
     *       200:
     *         description: Create a form.
     */
    server.post("/blog/set", cors(corsConfig), blogController.setBlog);
    /**
     * @openapi
     * paths:
     *  /blog/:
     *   get:
     *     tags:
     *       - Blog
     *     description: Create a blog
     *     responses:
     *       200:
     *         description: Create a blog.
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