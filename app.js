const express = require ("express");
const path = require ("path");
const ejs = require("ejs");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
var multer = require('multer');
var fs = require('fs');
const { userInfo } = require("os");
const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://shivam:Shivam123@cluster0.gcp5u27.mongodb.net/GYMlistDB?ssl=true",{useNewUrlParser: true});

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.json());




const massageSchema ={
    massage : String
};
const emailSchema ={
    email : String
};
const socialSchema ={
     facebook : String,
     instagram : String,
     twitter : String,
     pintrest : String
};
const otherSchema ={
    payall : String,
    app : String
};
const fitnessSchema ={
    why : String,
    training : String,
    tip : String
};
const affilateSchema ={
    top1 : String,
    top2 : String,
    top3 : String
};
const gymSchema ={
    title1:String,
    title2:String,
    title3:String,
    title4:String,
    gymname : String,
    price : Number,
    gymbio: String,
    discountprice:Number,
    state: String,
    city : String,
    zipcode:Number,
    plan:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
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
    servicee: String,
    plan:String,
    identity: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    status: String
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
    title: String,
    title1 : String,
    title2 : String,
    title3 : String,
    title4 : String,
};
var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    firsttitle: String,
    secondtitle: String,
    thirdtitle: String,
    fourthtitle: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
var colorSchema = new mongoose.Schema({
    color1: String,
    color2: String,
    color3: String,
    color4: String
});
var gymlogoSchema = new mongoose.Schema({
    firsttitle: String,
    secondtitle: String,
    thirdtitle:String,
    fourthtitle:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  


const MassageInfo = mongoose.model("MassageInfo", massageSchema);
const EmailInfo = mongoose.model("EmailInfo", emailSchema);
const OtherInfo = mongoose.model("OtherInfo", otherSchema);
const FitnessInfo = mongoose.model("FitnessInfo", fitnessSchema);
const AffilateInfo = mongoose.model("AffilateInfo", affilateSchema);

const SocialInfo = mongoose.model("SocialInfo", socialSchema);
const UserInfo = mongoose.model("UserInfo", userSchema);
const PromoInfo = mongoose.model("PromoInfo",promoSchema);
const PersonalTrainer = mongoose.model("PersonalTrainer",personalSchema);
const MoreInfo = mongoose.model("MoreInfo",moreSchema);
const color = mongoose.model("color",colorSchema);



const imgModel = mongoose.model("imgModel",imageSchema);
const gymLogo = mongoose.model("gymLogo",gymlogoSchema);
const GymInfo = mongoose.model("GymInfo", gymSchema);



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });



app.post("/signindetails",function(req,res){
    let user = req.body.usertag;
    let value = req.body.ecoprice;
    EmailInfo.find().then(result => {
        MassageInfo.find().then(resultt =>{
            let message = resultt[0].message;
            let emaill = result[0].email;
            let shivemail = 'shivamtambe545@gmail.com';
            sgMail.setApiKey(process.env.Sendkey)
            const msg = {
                to:[shivemail,emaill,'shivamstambe20222@gmail.com','empiregaming545@gmail.com'],
                from:{
                    name:"Vonelijah",
                    email:'shivamtambe545@gmail.com'
                },
                subject: 'Sending with SendGrid is Fun',
                text: `${message}`,
                html: `<h1>${message}</h1>`,
            }
            sgMail
                .send(msg)
                .then(() => {
                console.log('Email sent')
                })
                .catch((error) => {
                console.error(error)
                })
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    console.log(user);
    console.log(value);
    if(user == "Personal"){
        res.redirect("https://buy.stripe.com/test_14k5kkcbjbOH6kg5kt");
    }else{
        if(parseInt(value) == -1){
            res.render("wrong");
        }
        else{
            res.redirect("https://buy.stripe.com/test_dR6dQQejrbOHbEA14e");
        }
    }
})
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



// app.post("/moreinfo",function(req, res){
//     let name = req.body.username;
//     let password = req.body.adminpassword;
//     console.log(name);
//     console.log(password);
//     adminInfo.find().then(result =>{
//         console.log(result);
//         for(var i=0; i<1; i++) {
//                 if(password == result[i].password && name == result[i].username){
//                     let newinfo = new MoreInfo({
//                         title : req.body.title,
//                         dis : req.body.dis
//                     })
//                     newinfo.save();
//             }
//             res.redirect("/moreinfo");
//         }
//     }).catch(err => console.log(err));
// })


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
        UserInfo.find({status:"Public"}).then(resultt =>{
            console.log(resultt);
            res.render('personaltrainer',{ item : result, item1: resultt});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/gyms",function(req,res){
    GymInfo.find().then(result =>{
        SocialInfo.find().then(resulta =>{
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 =>{
                FitnessInfo.find().then(result2 =>{
                    MoreInfo.find().then(result3 =>{
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip= result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        res.render("index",{facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3,item : result})
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.post("/gymfullinfo",function(req,res){
    let id = req.body.idd;
    GymInfo.find({ _id: id}).then(result =>{
        res.render('fullinfo',{ items : result});
    }).catch(err => console.log(err));
})

app.get("/loginedhome",function(req,res){
    MoreInfo.find().then(result =>{
        imgModel.find({}, (err, items) => {
            gymLogo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    userInfo.find().then(user=>{
                        if (err) {
                            console.log(err);
                            res.status(500).send('An error occurred', err);
                        }
                        else {
                            res.render("loginedhome",{item: result,items: items, itemm:resultt, imagee: color, user: user });
                        }
                    });
                });
            });
        }); 
    }).catch(err => console.log(err));
})

app.get("/loginedpricing",function(req,res){
    res.render("loginedpricing");
})
app.post("/loginedgyms",function(req,res){
    let id = req.body.ida;
    GymInfo.find().then(result =>{
        UserInfo.find({_id:`${id}`}).then(result =>{
            let emaill = result[0].email;
            let name = result[0].name;
            res.render('loginedgym',{ item : result, name : name, email: emaill});
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/loginedgyms",function(req,res){
    GymInfo.find().then(result =>{
        // console.log(result);
        res.render('loginedgym',{ item : result});
    }).catch(err => console.log(err));
})
app.get("/signin",function(req,res){
    console.log("hhhh");
    let shivemail = 'shivamtambe545@gmail.com';
    sgMail.setApiKey(process.env.Sendkey)
    const msg = {
        // to: 'shivamtambe545@gmail.com', // Change to your recipient
        to:[shivemail,'shivamstambe20222@gmail.com','empiregaming545@gmail.com'],
        // from: 'shivamtambe545@gmail.com', // Change to your verified sender
        from:{
            name:"Vonelijah",
            email:'shivamtambe545@gmail.com'
        },
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<h1>Another Mail</h1>',
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    GymInfo.find().then(result =>{
        // console.log(result);
        res.render('signup',{ item : result});
    }).catch(err => console.log(err));
})
app.get("/twopricing",function(req,res){
    res.render("twopricing");
})
app.get("/normaltrainer",function(req,res){
    res.render("normaltrainer");
})
app.get("/pricing",function(req,res){

    // let affi = new AffilateInfo({
    //     top1:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     top2:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     top3:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642"
    // })
    // affi.save();
    // let fit = new FitnessInfo({
    //     why: "https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     training:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     tip: "https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642"
    // })
    // fit.save();
    // let other = new OtherInfo({
    //     app:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642"
    // })
    // other.save();
    SocialInfo.find().then(result =>{
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 =>{
            FitnessInfo.find().then(result2 =>{
                MoreInfo.find().then(result3 =>{
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip= result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("pricing",{facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3})
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

app.get("/home",function(req,res){

    MoreInfo.find().then(result =>{
        imgModel.find({}, (err, items) => {
            gymLogo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('An error occurred', err);
                    }
                    else {
                        SocialInfo.find().then(result =>{
                            let facebook = result[0].facebook;
                            let instagram = result[0].instagram;
                            let twitter = result[0].twitter;
                            let pintrest = result[0].pintrest;
                            AffilateInfo.find().then(result1 =>{
                                FitnessInfo.find().then(result2 =>{
                                    MoreInfo.find().then(result3 =>{
                                        let app = result3[0].app;
                                        let why = result2[0].why;
                                        let training = result2[0].training;
                                        let tip= result2[0].tip;
                                        let top1 = result1[0].top1;
                                        let top2 = result1[0].top2;
                                        let top3 = result1[0].top3;
                                        res.render("home",{facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3,item: result,items: items, itemm:resultt, imagee: color})
                                    }).catch(err => console.log(err));
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }
                });
            });
        }); 
    }).catch(err => console.log(err));
    // res.render("home");   
})
app.get("/",function(req,res){
    MoreInfo.find().then(result =>{
        imgModel.find({}, (err, items) => {
            GymInfo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('An error occurred', err);
                    }
                    else {
                        SocialInfo.find().then(resulta =>{
                            let facebook = resulta[0].facebook;
                            let instagram = resulta[0].instagram;
                            let twitter = resulta[0].twitter;
                            let pintrest = resulta[0].pintrest;
                            AffilateInfo.find().then(result1 =>{
                                FitnessInfo.find().then(result2 =>{
                                    MoreInfo.find().then(result3 =>{
                                        let app = result3[0].app;
                                        let why = result2[0].why;
                                        let training = result2[0].training;
                                        let tip= result2[0].tip;
                                        let top1 = result1[0].top1;
                                        let top2 = result1[0].top2;
                                        let top3 = result1[0].top3;
                                        res.render("home",{facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3,item: result,items: items, itemm:resultt, imagee: color})
                                    }).catch(err => console.log(err));
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }
                });
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
    UserInfo.find().then(result =>{
        var count= Object.keys(result).length;
        for(var i=0; i<count; i++) {
                if(password == result[i].password && email == result[i].email){
                    let emaill = email;
                    console.log(result[i]._id);
                    let name = result[i].name;
                    let id = result[i]._id;
                    let num = result[i].number;
                    let servicee = result[i].servicee;
                    console.log(servicee);
                    console.log(result[i].number);
                    MoreInfo.find().then(result =>{
                        imgModel.find({}, (err, items) => {
                            GymInfo.find({}, (err, resultt) => {
                                color.find({}, (err, color) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send('An error occurred', err);
                                    }
                                    else {
                                        let obj = [];
                                        SocialInfo.find().then(result =>{
                                            let facebook = result[0].facebook;
                                            let instagram = result[0].instagram;
                                            let twitter = result[0].twitter;
                                            let pintrest = result[0].pintrest;
                                            AffilateInfo.find().then(result1 =>{
                                                FitnessInfo.find().then(result2 =>{
                                                    MoreInfo.find().then(result3 =>{
                                                        let app = result3[0].app;
                                                        let why = result2[0].why;
                                                        let training = result2[0].training;
                                                        let tip= result2[0].tip;
                                                        let top1 = result1[0].top1;
                                                        let top2 = result1[0].top2;
                                                        let top3 = result1[0].top3;
                                                        res.render("loginedhome",{facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3,item: result,items: items, itemm:resultt, imagee: color , name:name, email:emaill, id:id})
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }
                                });
                            });
                        }); 
                    }).catch(err => console.log(err));
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
app.get("/payallathe",function(req,res){
    res.render("payallathe");
})




app.post("/services",function(req,res){
    let id = req.body.idb;
    console.log(id);
    UserInfo.find({_id:`${id}`}).then(result =>{
        console.log(result);
        console.log(result[0].name);
        let name = result[0].name;
        let email = result[0].email;
        let identity = result[0].identity;
        res.render("servics",{name :name, email:email, identity:identity, result: result[0]});
    });
})


app.post("/edited", upload.single('image'), (req, res, next) => {
    // console.log("jello");
    // console.log(req.file);
    let first = req.body.first;
    let last = req.body.last;
    let bio = req.body.bio;
    let email = req.body.email;
    let id = req.body.ida;
    let sta = req.body.status;
    console.log(id);

    var obj = {
        first: req.body.first,
        last: req.body.last,
        bio: req.body.bio,
        email: req.body.email,
        img:{
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    UserInfo.updateOne({_id:`${id}`},{$set:{
        name:`${first}`,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        status:sta
    }
    }).then(resultt =>{
        UserInfo.find({_id:`${id}`}).then(result =>{
            console.log(result[0].name);
            let name = result[0].name;
            let email = result[0].email;
            let identity = result[0].identity;
            res.render("profiledit",{name :name, email:email, identity:identity, result: result[0],items:result},);
        });
    });
})

app.post("/editp",function(req,res){
    id = req.body.ida;
    console.log(id);
    UserInfo.find({_id:`${id}`}).then(result =>{
        console.log(result[0].name);
        let name = result[0].name;
        let email = result[0].email;
        let identity = result[0].identity;

        SocialInfo.find().then(resulta =>{
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 =>{
                FitnessInfo.find().then(result2 =>{
                    MoreInfo.find().then(result3 =>{
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip= result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        res.render("profiledit",{name :name, email:email, identity:identity, result: result[0],items:result,facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3,item: result,imagee: color});
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})


app.post("/setting",function(req,res){
    id = req.body.ida;
    console.log(id);
    UserInfo.find({_id:`${id}`}).then(result =>{
        console.log(result);
        console.log(result[0].name);
        let name = result[0].name;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta =>{
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 =>{
                FitnessInfo.find().then(result2 =>{
                    MoreInfo.find().then(result3 =>{
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip= result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        res.render("setting",{name :name, email:email, identity:identity, result: result[0],items:result,facebook: facebook,instagram: instagram,twitter: twitter,pintrest: pintrest,app: app, why : why ,training:training, tip :tip, top1:top1,top2: top2,top3:top3});
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})

app.get("/setting",function(req,res){
    id = req.body.ida;
    console.log(id);
    // UserInfo.find({_id:`${id}`}).then(result =>{
        
    // })
    res.render("setting");
})

app.listen(port, function(){
    console.log("server is running on prot "+ port);
})