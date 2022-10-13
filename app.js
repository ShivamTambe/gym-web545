const express = require ("express");
const path = require ("path");
const ejs = require("ejs");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://shivam:Shivam123@cluster0.gcp5u27.mongodb.net/GYMlistDB?ssl=true",{useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.json());

const gymSchema ={
    gymname : String,
    price : Number,
    gymbio: String,
    discountprice:Number,
    state: String,
    city : String,
    zipcode:Number
};

const GymInfo = mongoose.model("GymInfo", gymSchema);

app.get("/",function(req,res){
    GymInfo.find().then(result =>{
        // console.log(result);
        res.render('index',{ item : result});
    }).catch(err => console.log(err));
})

app.get("/pricing",function(req,res){
    res.render("pricing");
})
app.get("/home",function(req,res){
    res.render("home");
})
app.listen(port, function(){
    console.log("server is running on prot "+ port);
})