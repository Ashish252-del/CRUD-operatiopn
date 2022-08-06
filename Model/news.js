const mongoose = require("mongoose");
// creating scheama
const newssheama = new mongoose.Schema({
    headline: { type: String },
    author: { type: String },
    description: { type: String },
    location: { type: String }
});
const newsModel = mongoose.model("news", newssheama);
module.exports = newsModel;