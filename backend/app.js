const express = require('express');
const bodyParser = require('body-parser');
const path = require("path")
const mongoose = require('mongoose');
const postsRoutes = require("./routes/posts")
const userRoutes = require("./routes/user")

const app = express();

mongoose.connect("mongodb+srv://anithab:" + process.env.MONGO_ATLAS_PW + "@cluster0.gggzs3v.mongodb.net/test").then(() => {
    console.log('Connected to database!');
})
.catch(()=> {
    console.log('Unable to connect to database');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use("/images", express.static(path.join("backend/images")))

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    next();
})

// app.use((req, res, next) => {
//     console.log('First middleware');
//     next();
// })

// app.use((req, res, next) => {
//     res.send('Hello from express!')
// })

app.use(postsRoutes);
app.use(userRoutes);
module.exports = app;


//  npm install --save-dev nodemon
//  npm install --save body-parser
//  npm install --save multer
//  npm install --save mongoose-unique-validator
//  npm install --save bcrypt
//  npm install --save jsonwebtoken