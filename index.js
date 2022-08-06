const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const detabaseconnection = require("./Detabaseconnection/detabaseconnection");

const Author_Model = require("./Model/Author");
const News_Model = require("./Model/news");
// Post request from frontend to backend in form of payload
app.post("/Authorentry", async (req,res) => {
    try {
        const { name, email, password, phn, Add, publicationno, } = req.body;
        const encrypted = await bcrypt.hash(password, 12);
        const newAuthor = new Author_Model({
            name, email, password: encrypted, phn, Add, publicationno,
            
        });
        await newAuthor.save();
        res.json({ success: true, message: "new author_entry is taken" })
    } catch (error) {
        console.log("error");
        res.json({ success: false });
    }
});

app.get("/authordetail", async (req,res) => {
    try {
        console.log("fatching data");
        const data = await Author_Model.find();
        res.json({success:true,data})
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
})
app.put("/updatename", async (req, res) => {
    try {
        const updatedocument = await Author_Model.findOneAndUpdate(
            { name: req.body.name }, // which document to update
            { password: req.body.newname }// what value to update: updated value
        );
        res.json({ success: true, message:"name is updated" });
    }
        catch (error) {
            res.status(400).json({success:false})
        }
    
})
app.post("/newsdata", async(req,res) => {
    try {
        const { headline,
            author,
            description,
            location } = req.body;
        const newnews = new News_Model({
            headline,
            author,
            description,
            location
        });
        await newnews.save();
        res.json({success:true,message:"new news is reported",newnews})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ success: false });
    }
}) 

app.get("/newsinfo",async (req, res) => {
    try {
        const data = await News_Model.find();
        res.json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false})
    }
})
app.get("/newsinfo/:name", async(req, res) => {
    try { 
        const data = await News_Model.find({ author: req.params.name });
        res.json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false})
    }
})
app.get("/newsinfowithlocation",async (req, res) => {
    try {
        const { location } = req.body;
        const data = await News_Model.find({ location });
        res.json({ success: true, data });
    } catch (error) {
        console.log(error);
        res.status(400).json({success:false})
    }
})
app.delete("/deletnews",async (req, res) => {
    try {
        const del =await News_Model.findOneAndDelete({
            headline: req.body.headline
        })// which document is to be deleted: name of the document
        res.json({ success: true, Data: `${del} is deleted ` });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
    }
        })
    
    



detabaseconnection();
// creating server
let port = 8000;
app.listen(port, () => console.log(`server is running at ${port}`));