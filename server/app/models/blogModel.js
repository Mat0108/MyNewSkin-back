const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    imagepresentation:{
        type:String,
        require: true
    },
    textpresentation:{
        type:String,
        require: true
    },
    titlelist:[{
        type:String
    }],
    textlist:[{
        type:String
    }],
    imagelist:[{
        type:String
    }],
    altimage:[{
        type:String
    }],
    textcolor:[{
        type:String
    }],
    layout:[{
        type:String
    }],
    margin:{
        type:String
    }
});

module.exports = mongoose.model("Blog", blogSchema);