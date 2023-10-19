const Blog = require("../models/blogModel");
exports.setBlog  = (req, res) => {
    let newBlog = new Blog(newBlog.titlelist.toString().split('#%'));
    console.log(newBlog.titlelist.toString().split('#%'))
    newBlog.titlelist= newBlog.titlelist.toString().split('#%');
    newBlog.textlist= newBlog.textlist.toString().split('#%');
    newBlog.imagelist= newBlog.imagelist.toString().split('#%');
    newBlog.altimage= newBlog.altimage.toString().split('#%');
    newBlog.textcolor= newBlog.textcolor.toString().split('#%');
    newBlog.layout= newBlog.layout.toString().split('#%');
    newBlog.save((error, blog) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: error});
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
}

exports.getBlog = (req, res) => {

    Blog.findById(req.params.blogId, (error, blog) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message:error });
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
}

exports.getAllBlog = (req, res) => {
    Blog.find({}, (error, blog) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message:error });
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
}
exports.deleteBlog = (req, res) => {
    Blog.deleteOne({ _id: req.params.blogId })
        .then(result => res.status(200).json({ message: "Blog est bien supprimé", result }))
        .catch((error) => res.status(404).json({ message: "Blog non trouvé" }))
};