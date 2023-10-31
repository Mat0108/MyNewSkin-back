module.exports = (server,corsConfig) => {
    const blogController = require("../controllers/blogController");
    const cors = require('cors');


    server.post("/blog/set", cors(corsConfig), blogController.setBlog);
    server.get("/blog/",cors(corsConfig),blogController.getAllBlog);
    server.get("/blog/get/id/:blogId",cors(corsConfig),blogController.getBlog);
    server.get("/blog/get/alt/:altId",cors(corsConfig),blogController.getBlogByField);
    server.get("/blog/get/search/:searchId",cors(corsConfig),blogController.searchBlog);
    server.delete("/blog/get/:blogId",cors(corsConfig),blogController.deleteBlog);
}