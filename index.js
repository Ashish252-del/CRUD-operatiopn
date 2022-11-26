const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const detabaseconnection = require("./Detabaseconnection/detabaseconnection");

const ImageModel = require('./Model/image')
const Author_Model = require("./Model/Author");
const News_Model = require("./Model/news");
// We will upload image on cloudinary after that the ulr of image will be save on
// mongodb
// step1: npm i cloudinary
// step2: npm i express-fileupload
// after that
const cloudinary = require("cloudinary").v2;
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles:true
}))
// these informations is available on cloudinary account
cloudinary.config({
  cloud_name: 'darrtuoca', 
  api_key: '776137516265653', 
  api_secret: 'W0k6isy1dQJoTP2qVe4xIjKSHmI' ,
  secure: true,
});


// Post request from frontend to backend in form of payload
const path = require("path");

const fs = require("fs");

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
    
        // writing post api for uploading images
app.post('/upload', (req, res) => {
    console.log(req.body);
    // photo is name of file under which the image will come
    // that's why from frontend the image should come with name photo
    const file = req.files.photo;
    console.log(file)
    // code for uploading on cloudinary
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      if (result) {
        try {
          const newImage = new ImageModel({
            name: result.name,
            image: result.url,
          });
            await newImage.save();
            // here we are clearing temp file after saving and uploading
            var filePath = file.tempFilePath;
            fs.unlinkSync(filePath);
            res.json({message:"image uploaded"})
        } catch (error) {
            console.log(error);
             var filePath = file.tempFilePath;
             fs.unlinkSync(filePath);
        }
      }
    });
    })

// deleting image from cloudinary
app.delete('/deletepic', async(req, res) => {
  const imageUrl = req.body.imageUrl;
  // basically here we are finding out name of image from url
  //http://res.cloudinary.com/darrtuoca/image/upload/v1669488719/dpioebukjapfe9qreaqe.png
  // for example in above url the name of image is dpioebukjapfe9qreaqe
  const urlArray = imageUrl.split("/");
  console.log(urlArray);
  const img = urlArray[urlArray.length - 1];
  console.log(img);
  const imageName = img.split(".")[0];
    console.log(imageName);
    // code for deleting the image from cloudinary and document from mongodb
  const del = ImageModel.findOneAndDelete({
    image: imageUrl,
  })
    .then(() => {
      cloudinary.uploader.destroy(imageName, (result, error) => {
        if (result) console.log(result);
        else console.log(error);
      });
      res.json({ message: "deleted" });
    })
    .catch((error) => {
      console.log(error);
    });
})



detabaseconnection();
// creating server
let port = 8000;
app.listen(port, () => console.log(`server is running at ${port}`));



// we are deleting this image
// {
//   "_id": {
//     "$oid": "6382604fe8b0ab4ad42b62f0"
//   },
//   "image": "http://res.cloudinary.com/darrtuoca/image/upload/v1669488719/dpioebukjapfe9qreaqe.png",
//   "__v": 0
// }