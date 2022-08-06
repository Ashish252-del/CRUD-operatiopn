const mongoose = require("mongoose");
const detabaseconnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/classesdetabase")
    console.log("Detabase is connected")    
    } catch (error) {
        console.log(error);
    }
}
module.exports = detabaseconnection;