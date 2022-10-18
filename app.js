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

const userSchema ={
    name : String,
    service : String,
    userbio: String,
    city: String,
    state: String,
    zipcode : Number,
    email : String,
    password : String,
    number: String
};

const promoSchema={
    promocode: String,
    value: Number
}

const GymInfo = mongoose.model("GymInfo", gymSchema);
const UserInfo = mongoose.model("UserInfo", userSchema);
const PromoInfo = mongoose.model("PromoInfo",promoSchema);


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
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/signup",function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    let a=0;
    UserInfo.find().then(result =>{
        var count= Object.keys(result).length;
        for(var i=0; i<count; i++) {
                if(password == result[i].password && email == result[i].email){
                    console.log(result[i]._id);
                    let num = result[i].number;
                    console.log(result[i].number);
                    GymInfo.find().then(resultt =>{
                        res.render('loginedhome',{ item : resultt, no : num});
                    }).catch(err => console.log(err));
                    a++;
                    console.log(a);
            }
        }
    }).catch(err => console.log(err));
    GymInfo.find().then(resultt =>{
        console.log(a);
        if(a==0){
            GymInfo.find().then(resultt =>{
                res.render('login');
            }).catch(err => console.log(err));
        }
    }).catch(err => console.log(err));
})
app.post("/promo",function(req,res){
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({promocode:`${promocodee}`}).then(result =>{
        console.log(result);
        console.log(result[0].value);
        res.render('promoprice',{ value1 : result[0].value});
    }).catch(err => console.log(err));
})

app.post("/promo2",function(req,res){
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({promocode:`${promocodee}`}).then(result =>{
        res.render('promoprice',{ value1 : result[0].value});
    }).catch(err => console.log(err));
})


app.listen(port, function(){
    console.log("server is running on prot "+ port);
})