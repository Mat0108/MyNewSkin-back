module.exports = (server) => {
    const blogController = require("../controllers/blogController");
    const cors = require('cors');


    server.post("/blog/set", cors(), blogController.setBlog);
    server.get("/blog/",cors(),blogController.getAllBlog);
    server.get("/blog/get/id/:blogId",cors(),blogController.getBlog);
    server.get("/blog/get/alt/:altId",cors(),blogController.getBlogByField);
    server.get("/blog/get/search/:searchId",cors(),blogController.searchBlog);
    server.delete("/blog/get/:blogId",cors(),blogController.deleteBlog);
}