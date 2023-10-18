module.exports = (server) => {
    const blogController = require("../controllers/blogController");
    const cors = require('cors');


    server.post("/blog/set", cors(), blogController.setBlog);
    server.get("/blog/",cors(),blogController.getAllBlog)
    server.get("/blog/get/:blogId",cors(),blogController.getBlog)
    server.delete("/blog/get/:blogId",cors(),blogController.deleteBlog)
}