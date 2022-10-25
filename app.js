const express = require ("express");
const path = require ("path");
const ejs = require("ejs");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
var multer = require('multer');

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
    number: String,
    servicee: String
};
const personalSchema={
    trainername: String,
    trainerbio: String,
    location: String
}
const promoSchema={
    promocode: String,
    value: Number
};
const moreSchema ={
    title : String,
    dis : String
};
var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    firsttitle: String,
    secondtitle: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
var gymlogoSchema = new mongoose.Schema({
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  



const GymInfo = mongoose.model("GymInfo", gymSchema);
const UserInfo = mongoose.model("UserInfo", userSchema);
const PromoInfo = mongoose.model("PromoInfo",promoSchema);
const PersonalTrainer = mongoose.model("PersonalTrainer",personalSchema);
const MoreInfo = mongoose.model("MoreInfo",moreSchema);



const imgModel = mongoose.model("imgModel",imageSchema);
const gymLogo = mongoose.model("gymLogo",gymlogoSchema);



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });




// app.get('/upload', (req, res) => {
//     imgModel.find({}, (err, items) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         else {
//             res.render('imagePage', { items: items });
//         }
//     });
// });

// app.post('/upload', upload.single('image'), (req, res, next) => {
  
//     var obj = {
//         name: req.body.name,
//         desc: req.body.desc,
//         firsttitle: req.body.firsttitle,
//         secondtitle: req.body.secondtitle,
//         img:{
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     imgModel.create(obj, (err, item) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             // item.save();
//             res.redirect('/upload');
//         }
//     });
// });



app.post("/moreinfo",function(req, res){
    let name = req.body.username;
    let password = req.body.adminpassword;
    console.log(name);
    console.log(password);
    adminInfo.find().then(result =>{
        console.log(result);
        for(var i=0; i<1; i++) {
                if(password == result[i].password && name == result[i].username){
                    let newinfo = new MoreInfo({
                        title : req.body.title,
                        dis : req.body.dis
                    })
                    newinfo.save();
            }
            res.redirect("/moreinfo");
        }
    }).catch(err => console.log(err));
})


app.post("/loginedgym",function(req,res){
    let servicee =  req.body.service;
    let num = req.body.number;
    console.log(servicee);
    console.log(num);
    if(servicee == "economical"){
        GymInfo.find({ discountprice: {$lte:150, $gt:50}}).then(result =>{
            console.log(servicee);
            // console.log(result);
            res.render('loginedgym',{ item : result, no : num,  s: servicee});
        }).catch(err => console.log(err));
    }
    else{
        if(servicee=="premimum"){
            GymInfo.find({ discountprice: {$lte:500, $gt:0}}).then(result =>{
                console.log("second");
                res.render('loginedgym',{ item : result, no : num,  s: servicee});
            }).catch(err => console.log(err));
        }else{
            res.render("nodetails");
        }
    }
})


app.get("/personaltrainer",function(req,res){
    let users;
    PersonalTrainer.find().then(result =>{
        console.log(result);
        UserInfo.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/gyms",function(req,res){
    GymInfo.find().then(result =>{
        // console.log(result);
        res.render('index',{ item : result});
    }).catch(err => console.log(err));
})


app.get("/loginedhome",function(req,res){
    res.render("loginedhome");
})
app.get("/loginedpricing",function(req,res){
    res.render("loginedpricing");
})
app.get("/loginedgyms",function(req,res){
    GymInfo.find().then(result =>{
        // console.log(result);
        res.render('loginedgym',{ item : result});
    }).catch(err => console.log(err));
})
app.get("/signin",function(req,res){
    res.render("signup");
})
app.get("/twopricing",function(req,res){
    res.render("twopricing");
})
app.get("/normaltrainer",function(req,res){
    res.render("normaltrainer");
})
app.get("/pricing",function(req,res){
    res.render("pricing");
})
app.get("/home",function(req,res){
    MoreInfo.find().then(result =>{
        imgModel.find({}, (err, items) => {
            gymLogo.find({}, (err, resultt) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                    res.render("home",{item: result,items: items, itemm:resultt });
                }
            });
        }); 
    }).catch(err => console.log(err));
    // res.render("home");   
})
app.get("/",function(req,res){
    MoreInfo.find().then(result =>{
        imgModel.find({}, (err, items) => {
            gymLogo.find({}, (err, resultt) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                    res.render("home",{item: result,items: items, itemm:resultt });
                }
            });
        }); 
    }).catch(err => console.log(err));
})
app.get("/signup",function(req,res){
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
                    let servicee = result[i].servicee;
                    console.log(servicee);
                    console.log(result[i].number);
                    GymInfo.find().then(resultt =>{
                        // res.render('loginedhome',{ no : num, s: servicee});
                        res.render('loginedhome',{ no : num, s: servicee});
                    }).catch(err => console.log(err));
                    a++;
                    console.log(a);
            }
        }
    }).catch(err => console.log(err));

    // GymInfo.find().then(resultt =>{
    //     console.log(a);
    //     if(a==0){
    //         GymInfo.find().then(resultt =>{
    //             res.render('login');
    //         }).catch(err => console.log(err));
    //     }
    // }).catch(err => console.log(err));
})
app.post("/promo",function(req,res){
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({promocode:`${promocodee}`}).then(result =>{
        console.log(result);
        console.log(result[0].value);
        res.render('promoprice',{value1 : result[0].value});
    }).catch(err => console.log(err));
})

app.post("/promo2",function(req,res){
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({promocode:`${promocodee}`}).then(result =>{
        res.render('promoprice',{ value1 : result[0].value});
    }).catch(err => console.log(err));
})


app.post("/searchbyname",function(req,res){
    let name = req.body.username;
    PersonalTrainer.find({trainername:`${name}`}).then(result =>{
        console.log(result[0].trainername);
        UserInfo.find().then(resultt =>{
            // console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbycity",function(req,res){
    let name = req.body.usercity;
    PersonalTrainer.find({city:`${name}`}).then(result =>{
        UserInfo.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbystate",function(req,res){
    let name = req.body.userstate;
    PersonalTrainer.find({state:`${name}`}).then(result =>{
        UserInfo.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbyzip",function(req,res){
    let name = req.body.userzip;
    PersonalTrainer.find({zipcode:`${name}`}).then(result =>{
        UserInfo.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.post("/searchbynamee",function(req,res){
    let name = req.body.username;
    console.log(name);
    UserInfo.find({name:`${name}`}).then(result =>{
        console.log(result);
        PersonalTrainer.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : resultt, item1: result});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbycityy",function(req,res){
    let name = req.body.usercity;
    UserInfo.find({city:`${name}`}).then(result =>{
        PersonalTrainer.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item: result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbystatee",function(req,res){
    let name = req.body.userstate;
    UserInfo.find({state:`${name}`}).then(result =>{
        PersonalTrainer.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbyzipp",function(req,res){
    let name = req.body.userzip;
    UserInfo.find({zipcode:`${name}`}).then(result =>{
        PersonalTrainer.find().then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})




app.listen(port, function(){
    console.log("server is running on prot "+ port);
})