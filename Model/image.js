const mongoose = require("mongoose");
const ImageSchema = mongoose.Schema({
    name: {
        type:String,
    },
    image: {
       type:String
    }
})
const ImageModel = mongoose.model("image", ImageSchema)
module.exports = ImageModel;