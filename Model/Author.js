const mongoose = require("mongoose");

const AuthorModel = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String, trim: true, unique: true
    },
    password: {
        type: String
    },
    phn: { type: Number },
    Add: { type: String, },
    publicationno: { type: Number, unique: true }
}, { timestamps: true });

const AuthorModel1 = mongoose.model("Author", AuthorModel);// telling to mongodb that our model is ready , first parameter is name of collection 
// with same name collection will be made in monodb
module.exports = AuthorModel1;