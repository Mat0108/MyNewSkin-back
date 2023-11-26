const Blog = require("../models/blogModel");

// Route pour créer un nouvel article de blog
exports.setBlog  = (req, res) => {
    let newBlog = new Blog(req.body);

    newBlog.titlelist= newBlog.titlelist.toString().split('#%');
    newBlog.textlist= newBlog.textlist.toString().split('#%');
    newBlog.imagelist= newBlog.imagelist.toString().split('#%');
    newBlog.altimage= newBlog.altimage.toString().split('#%');
    newBlog.textcolor= newBlog.textcolor.toString().split('#%');
    newBlog.layout= newBlog.layout.toString().split('#%');
    
    // Enregistrement du nouvel article de blog
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

// Route pour récupérer un article de blog par ID
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

// Route pour récupérer un article de blog par champ spécifique (altimagepresentation)
exports.getBlogByField = (req, res) => {

    Blog.find({altimagepresentation:req.params.altId}, (error, blog) => {
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

// Route pour récupérer tous les articles de blog
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

// Route pour supprimer un article de blog par ID
exports.deleteBlog = (req, res) => {
    Blog.deleteOne({ _id: req.params.blogId })
        .then(result => res.status(200).json({ message: "Blog est bien supprimé", result }))
        .catch((error) => res.status(404).json({ message: "Blog non trouvé" }))
};

// Route pour rechercher des articles de blog par titre (utilisation d'expressions régulières pour la recherche)
exports.searchBlog = (req,res) =>{
    Blog.find( { "title": { "$regex": `${req.params.searchId}`, "$options": "i" } }, (error, blog) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message:message });
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
};