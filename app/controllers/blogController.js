// Importation du modèle de données du blog
const Blog = require("../models/blogModel");
const { ErrorMessage } = require("../config/config");
// Route pour créer un nouvel article de blog
exports.setBlog  = (req, res) => {
    // Création d'une nouvelle instance de Blog avec les données du corps de la requête
    let newBlog = new Blog(req.body);

    // Split des champs texte en listes basées sur le séparateur '#%'
    newBlog.titlelist= newBlog.titlelist.toString().split('#%');
    newBlog.textlist= newBlog.textlist.toString().split('#%');
    newBlog.imagelist= newBlog.imagelist.toString().split('#%');
    newBlog.altimage= newBlog.altimage.toString().split('#%');
    newBlog.textcolor= newBlog.textcolor.toString().split('#%');
    newBlog.layout= newBlog.layout.toString().split('#%');
    
    // Enregistrement du nouvel article de blog dans la base de données
    newBlog.save((error, blog) => {
        if (error) {
            // En cas d'erreur, renvoyer une réponse avec le statut 401 (Non autorisé) et un message d'erreur
            res.status(401);
            ErrorMessage(res,error,"Impossible de créer un blog")
        }
        else {
            // En cas de succès, renvoyer une réponse avec le statut 200 (OK) et les données du blog créé
            res.status(200);
            res.json({message:"Le blog a bien été crée",blog});
        }
    })
}

// Route pour récupérer un article de blog par ID
exports.getBlog = (req, res) => {
    // Recherche d'un article de blog par son identifiant unique dans la base de données
    Blog.findById(req.params.blogId, (error, blogs) => {
        if (error) {
            res.status(401);
            ErrorMessage(res,error,"Impossible de récuperer tous les blogs")
        
        }
        else {
            res.status(200);
            res.json({message:"Retourne tous les blogs",blogs});
        }
    })
}

// Route pour récupérer un article de blog par champ spécifique (altimagepresentation)
exports.getBlogByField = (req, res) => {
    // Recherche d'articles de blog par la valeur spécifiée dans le champ 'altimagepresentation'
    Blog.find({altimagepresentation:req.params.altId}, (error, blog) => {
        if (error) {
            res.status(401);
            ErrorMessage(res,error,"Impossible de récuperer le blog")
        
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
}

// Route pour récupérer tous les articles de blog
exports.getAllBlog = (req, res) => {
    // Récupération de tous les articles de blog dans la base de données
    Blog.find({}, (error, blog) => {
        if (error) {
            res.status(401);
            ErrorMessage(res,error,"Impossible de récuperer le blog")
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
}

// Route pour supprimer un article de blog par ID
exports.deleteBlog = (req, res) => {
    // Suppression d'un article de blog par son identifiant unique
    Blog.deleteOne({ _id: req.params.blogId })
        .then(result => res.status(200).json({ message: "le blog est bien supprimé", result }))
        .catch((error) => res.status(401).json({ message: "Impossible de supprimer le blog " }))
};

// Route pour rechercher des articles de blog par titre (utilisation d'expressions régulières pour la recherche)
exports.searchBlog = (req,res) =>{
    // Recherche d'articles de blog par titre avec une expression régulière (cas insensible à la casse)
    Blog.find( { "title": { "$regex": `${req.params.searchId}`, "$options": "i" } }, (error, blog) => {
        if (error) {
            res.status(401);
            ErrorMessage(res,error,"Impossible de récuperer tous le blog")
        
        }
        else {
            res.status(200);
            res.json(blog);
        }
    })
};
