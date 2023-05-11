const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
var multer = require('multer');
var fs = require('fs');
const { userInfo } = require("os");
const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv');

var http = require('http');
var paypal = require('paypal-rest-sdk');

dotenv.config();

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


mongoose.connect(process.env.MongoConnect, { useNewUrlParser: true });




app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json());

app.locals.baseurl = 'http://localhost:5000';
var config = {
    "port": 5000,
    "api": {
        "host": "api.sandbox.paypal.com",
        "port": "",
        "client_id": process.env.ClientId,
        "client_secret": process.env.ClinetSecerte
    }
}

paypal.configure(config.api);

// Page will display after payment has beed transfered successfully
app.post("/lasted", function (req, res) {
    let amount = req.body.amount;
    let id = req.body.id;
    let names = req.body.names;
    let gymsemails = req.body.gymsemails;
    let email = req.body.email;
    let finalprice = req.body.finalprice;
    let no = req.body.no;
    let plan = req.body.plan;
    let paymentId = req.body.paymentId;
    let token = req.body.token;
    let PayerID = req.body.PayerID;
    var json = JSON.parse(gymsemails);
    console.log(json);
    console.log(names);
    PremumuserInfo.find({email:email}).then(result => {
        let status = result[0].status;
        let payuser = new payInfo({
            names: req.body.names,
            gymsemails: req.body.gymsemails,
            email: req.body.email,
            id: req.body.id,
            finalprice: req.body.finalprice,
            amount: req.body.amount,
            no: req.body.no,
            plan: req.body.plan,
            paymentId: req.body.paymentId,
            token: req.body.token,
            PayerID: req.body.PayerID,
            status:status
        })
        payuser.save();
        let shivemail = 'shivamtambe545@gmail.com';
        let emailsarr = [];
        json.forEach(element => {
            sgMail.setApiKey(process.env.Sendkey)
            const msg = {
                to: [
                    element
                ],
                from: {
                    name: "Vonelijah",
                    email: 'shivamtambe545@gmail.com'
                },
                subject: 'New User Join Your Gym',
                text: `User ${email} Join Your Gym`,
                html: `<h1>User ${email} Join Your Gym</h1>`,
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error) => {
                    console.error(error)
                })
        });
        console.log(gymsemails);
            res.redirect("/signup");
    }).catch(err => console.log(err));
})
app.get('/success', function (req, res) {
    // var namelist = names.replace(/^\[|\]$/g, "").split(", ");
    // var gymsemailslist = emails.replace(/^\[|\]$/g, "").split(", ");
    let amount = req.query.amount;
    let id = req.query.id;
    let names = req.query.names;
    let gymsemails = req.query.emails;
    let email = req.query.email;
    let finalprice = req.query.finalprice;
    let no = req.query.no;
    let plan = req.query.plan;
    let paymentId = req.query.paymentId;
    let token = req.query.token;
    let PayerID = req.query.PayerID;
    let number = req.query.number;
    console.log("success");
    console.log(req.body.names);

    let paiduser = new PaidInfo({
        names: req.query.names,
        gymsemails: req.query.emails,
        email: req.query.email,
        id: req.query.id,
        finalprice: req.query.finalprice,
        amount: req.query.amount,
        no: req.query.no,
        plan: req.query.plan,
        paymentId: req.query.paymentId,
        token: req.query.token,
        PayerID: req.query.PayerID,
        number: req.body.number,
    })
    paiduser.save();
    //  let shivemail = 'shivamtambe545@gmail.com';
    // sgMail.setApiKey(process.env.Sendkey)
    // const msg = {
    //     to:'shivamtambe545@gmail.com',
    //     from:{
    //         name:"Vonelijah",
    //         email:'shivamtambe545@gmail.com'
    //     },
    //     subject: 'New User Join Your Gym',
    //     text: 'New User Join Your Gym',
    //     html: `<h1> New User Join Your Gym</h1>`,
    //   }
    //   sgMail
    //     .send(msg)
    //     .then(() => {
    //       console.log('Email sent')
    //     })
    //     .catch((error) => {
    //       console.error(error)
    //     })
    console.log(req.query);
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        TaxInfo.find().then(result => {
                            finalprice = parseFloat(amount) + parseFloat(amount * result[0].tax / 100);
                            res.render("final", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, finalprice: finalprice, email: email, no: no, plan: plan, names: names, emails: gymsemails, amount: amount, paymentId: PayerID, token: token, PayerID: PayerID,number:number })
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    // res.send("Payment transfered successfully.");
});
app.post("/last", function (req, res) {
    let paiduser = new PaidInfo({
        email: req.body.email,
        id: req.body.id,
        finalprice: req.body.amount,
        amount: req.body.amount,
        no: req.body.no,
        plan: req.body.plan,
        paymentId: req.body.paymentID,
        token: req.body.token,
        PayerID: req.body.PayerID,
        names: req.body.names,
        gymsemails: req.body.emails,
        number: req.body.number
    })

    paiduser.save();
    let emails = req.body.emails;
    EmailInfo.find().then(result => {
        MassageInfo.find().then(resultt => {
            let message = resultt[0].message;
            let emaill = result[0].email;
            let shivemail = 'shivamtambe545@gmail.com';
            var json = json.parse(emails);
            sgMail.setApiKey(process.env.Sendkey)
            const msg = {
                to: ["shivamtambe545@gmail.com"],
                from: {
                    name: "Vonelijah",
                    email: 'shivamtambe545@gmail.com'
                },
                subject: 'From Vonelijah',
                text: `${message}`,
                html: `<h1>${message}</h1>`,
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                    console.log("up");
                })
                .catch((error) => {
                    console.error(error)
                })
        }).catch(err => console.log(err));
        res.redirect('/signup');
    }).catch(err => console.log(err));
})

// Page will display when you canceled the transaction 
app.get('/cancel', function (req, res) {
    res.render("payment");
});


app.post('/paynow', function (req, res) {
    let email = "hello";
    let id = "2344"
    let n = req.body.amount
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": app.locals.baseurl + `/success?email=${email}&id=${id}`,
            "cancel_url": app.locals.baseurl + "/cancel"
        },
        "transactions": [{
            "amount": {
                "total": parseInt(req.body.amount),
                "currency": req.body.currency
            },
            "description": req.body.description
        }]
    };
    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
            if (payment.payer.payment_method === 'paypal') {
                req.paymentId = payment.id;
                var redirectUrl;
                console.log(payment);
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
        }
    });
});







const Pricing1Schema = {
    first:String,
    second:String,
    third:String,
    forth:String,
    fifth:String,
    sixth:String,
    seventh:String,
    eightth:String,
    nineth:String,
    tenth:String
};
const Pricing2Schema = {
    first:String,
    second:String,
    third:String,
    forth:String,
    fifth:String,
    sixth:String,
    seventh:String,
    eightth:String,
    nineth:String,
    tenth:String
};
const adminSchema = {
    username: String,
    password: String,
    id : String,
    less : Number,
    large:Number
};
const paySchema = {
    names: String,
    gymsemails: String,
    email: String,
    id: String,
    finalprice: String,
    amount: String,
    no: String,
    plan: String,
    paymentId: String,
    token: String,
    PayerID: String,
    status: String,
    number: Number
}
const paidSchema = {
    names: String,
    gymsemails: String,
    email: String,
    id: String,
    finalprice: String,
    amount: String,
    no: String,
    plan: String,
    paymentId: String,
    token: String,
    PayerID: String,
    number: Number,
    status:String
}
const taxSchema = {
    tax: Number
}
const arrySchema = {
    emails: [{
        type: String
    }],
    email: String
}
const massageSchema = {
    massage: String
};
const emailSchema = {
    email: String
};
const socialSchema = {
    facebook: String,
    instagram: String,
    twitter: String,
    pintrest: String
};
const otherSchema = {
    payall: String,
    app: String
};
const fitnessSchema = {
    why: String,
    training: String,
    tip: String
};
const affilateSchema = {
    top1: String,
    top2: String,
    top3: String
};
const gymSchema = {
    title1: String,
    title2: String,
    title3: String,
    title4: String,
    gymname: String,
    price: Number,
    gymbio: String,
    discountprice: Number,
    state: String,
    city: String,
    zipcode: Number,
    plan: String,
    plan2: String,
    email: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
};
const premimumuserSchema = {
    firstname: String,
    last: String,
    email: String,
    phoneno: String,
    address: String,
    date: String,
    gender: String,
    zipcode: String,
    emame: String,
    ephone: String,
    eemail: String,
    apt: String,
    password: String,
    confirmpassword: String,
    bio: String,
    plan: String,
    months: String,
    gyms: Array,
    state: String,
    city: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
};
const userSchema = {
    firstname: String,
    last: String,
    email: String,
    phoneno: String,
    address: String,
    date: String,
    gender: String,
    zipcode: String,
    emame: String,
    ephone: String,
    eemail: String,
    apt: String,
    password: String,
    confirmpassword: String,
    bio: String,
    state: String,
    city: String,
    service: String,
    name: String,
    status:String,
    img:
    {
        data: Buffer,
        contentType: String
    }
};
const personalSchema = {
    img:
    {
        data: Buffer,
        contentType: String
    },
    trainername: String,
    trainerbio: String,
    location: String,
    zipcode: String,
    state: String,
    city: String,
}
const promoSchema = {
    promocode: String,
    value: Number
};
const moreSchema = {
    title: String,
    title1: String,
    title2: String,
    title3: String,
    title4: String,
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
    thirdtitle: String,
    fourthtitle: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});


const PricingInfo1 = mongoose.model("PricingInfo1", Pricing1Schema);
const PricingInfo2 = mongoose.model("PricingInfo2", Pricing2Schema);
const payInfo = mongoose.model("payInfo", paySchema);
const PaidInfo = mongoose.model("PaidInfo", paidSchema);
const TaxInfo = mongoose.model("TaxInfo", taxSchema);
const PremumuserInfo = mongoose.model("PremumuserInfo", premimumuserSchema);
const ArrayInfo = mongoose.model("ArrayInfo", arrySchema);
const MassageInfo = mongoose.model("MassageInfo", massageSchema);
const EmailInfo = mongoose.model("EmailInfo", emailSchema);
const OtherInfo = mongoose.model("OtherInfo", otherSchema);
const FitnessInfo = mongoose.model("FitnessInfo", fitnessSchema);
const AffilateInfo = mongoose.model("AffilateInfo", affilateSchema);

const adminInfo = mongoose.model("adminInfo", adminSchema);
const SocialInfo = mongoose.model("SocialInfo", socialSchema);
const UserInfo = mongoose.model("UserInfo", userSchema);
const PromoInfo = mongoose.model("PromoInfo", promoSchema);
const PersonalTrainer = mongoose.model("PersonalTrainer", personalSchema);
const MoreInfo = mongoose.model("MoreInfo", moreSchema);
const color = mongoose.model("color", colorSchema);



const imgModel = mongoose.model("imgModel", imageSchema);
const gymLogo = mongoose.model("gymLogo", gymlogoSchema);
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





// const { auth } = require('express-openid-connect');

// const configg = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: 'a long, randomly-generated string stored in env',
//   baseURL: 'http://localhost:5000',
//   clientID: 'g34yBfL1jzL5o0YTs9MBoOxFZTxjnund',
//   issuerBaseURL: 'https://dev-1crzcirzhjrpysth.us.auth0.com'
// };

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(configg));

// // req.isAuthenticated is provided from the auth router
// app.get('/outhlogin', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// const { requiresAuth } = require('express-openid-connect');

// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });


app.post("/facebook", function (req, res) {
    let email = req.body.google;
    let name = req.body.displayname;
    let id;
    console.log(email);
    console.log(name);
    let a = 0;
    UserInfo.find().then(result => {
        console.log(result[0].email);
        console.log(email);
        if (email == result[0].email) {
            console.log("matched");
            a++;
            id = result[0]._id;
            if (a > 0) {
                let emaill = email;
                // console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                // console.log(servicee);
                // console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, resultt) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        // console.log(firstname);
                                                        res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
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
        } else {
            let newuser = new UserInfo({
                firstname: name,
                email: email
            })
            console.log(newuser);
            newuser.save()
            UserInfo.find({ email: `${email}` }).then(result => {
                console.log("NOTmatched");
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, resultt) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));

        }
    }).catch(err => console.log(err));

})
app.post("/formed", function (req, res) {
    let email = req.body.google;
    let name = req.body.displayname;
    let id;
    console.log(email);
    console.log(name);
    let a = 0;
    UserInfo.find({ email: `${email}` }).then(result => {
        console.log(result);
        console.log(result.length);
        if (result.length > 0) {
            if (email == result[0].email) {
                console.log("matched");
                a++;
                i = 0;
                id = result[0]._id;
                if (a > 0) {
                    let emaill = email;
                    console.log(result[i]._id);
                    let firstname = result[i].firstname;
                    let id = result[i]._id;
                    let num = result[i].number;
                    let servicee = result[i].servicee;
                    console.log(servicee);
                    console.log(result[i].number);
                    MoreInfo.find().then(more => {
                        imgModel.find({}, (err, items) => {
                            GymInfo.find({}, (err, resultt) => {
                                color.find({}, (err, color) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send('An error occurred', err);
                                    }
                                    else {
                                        let obj = [];
                                        SocialInfo.find().then(result => {
                                            let facebook = result[0].facebook;
                                            let instagram = result[0].instagram;
                                            let twitter = result[0].twitter;
                                            let pintrest = result[0].pintrest;
                                            AffilateInfo.find().then(result1 => {
                                                FitnessInfo.find().then(result2 => {
                                                    MoreInfo.find().then(result3 => {
                                                        let app = result3[0].app;
                                                        let why = result2[0].why;
                                                        let training = result2[0].training;
                                                        let tip = result2[0].tip;
                                                        let top1 = result1[0].top1;
                                                        let top2 = result1[0].top2;
                                                        let top3 = result1[0].top3;
                                                        UserInfo.find({ _id: id }).then(userinfo => {
                                                            console.log(firstname);
                                                            res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: more, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                        }).catch(err => console.log(err));
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
            } else {
                console.log("NOTmatched");
                let newuser = new UserInfo({
                    firstname: name,
                    email: email
                })
                newuser.save()
                UserInfo.find({ email: `${email}` }).then(result => {
                    let emaill = email;
                    let i = 0;
                    let firstname = result[i].firstname;
                    let id = result[i]._id;
                    console.log(id);
                    let num = result[i].number;
                    let servicee = result[i].servicee;
                    console.log(servicee);
                    console.log(result[i].number);
                    MoreInfo.find().then(more => {
                        imgModel.find({}, (err, items) => {
                            GymInfo.find({}, (err, resultt) => {
                                color.find({}, (err, color) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send('An error occurred', err);
                                    }
                                    else {
                                        let obj = [];
                                        SocialInfo.find().then(result => {
                                            let facebook = result[0].facebook;
                                            let instagram = result[0].instagram;
                                            let twitter = result[0].twitter;
                                            let pintrest = result[0].pintrest;
                                            AffilateInfo.find().then(result1 => {
                                                FitnessInfo.find().then(result2 => {
                                                    MoreInfo.find().then(result3 => {
                                                        let app = result3[0].app;
                                                        let why = result2[0].why;
                                                        let training = result2[0].training;
                                                        let tip = result2[0].tip;
                                                        let top1 = result1[0].top1;
                                                        let top2 = result1[0].top2;
                                                        let top3 = result1[0].top3;
                                                        UserInfo.find({ _id: id }).then(userinfo => {
                                                            console.log(firstname);
                                                            res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: more, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                        }).catch(err => console.log(err));
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }
                                });
                            });
                        });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
        } else {
            console.log("NOTmatched");
            let newuser = new UserInfo({
                firstname: name,
                email: email
            })
            newuser.save()
            UserInfo.find({ email: `${email}` }).then(result => {
                let emaill = email;
                let i = 0;
                let firstname = result[i].firstname;
                let id = result[i]._id;
                console.log(id);
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, resultt) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }

    }).catch(err => console.log(err));
})
app.post("/checkout4", function (req, res) {
    let users = req.body.users;
    let names = req.body.names;
    let gymsemails = req.body.emails;
    id = req.body.ida;
    let number = req.body.number;
    email = req.body.email;
    finalprice = req.body.finalprice;
    let amount = parseInt(finalprice);
    plan = req.body.plan;
    no = req.body.no;
    console.log(app.locals.baseurl);
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": app.locals.baseurl + `/success?email=${email}&id=${id}&finalprice=${finalprice}&amount=${amount}&no=${no}&plan=${plan}&number=${number}`,
            "cancel_url": app.locals.baseurl + "/cancel"
        },
        "transactions": [{
            "amount": {
                "total": amount,
                "currency": "USD"
            },
            "description": "Sign for months"
        }]
    };
    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
            if (payment.payer.payment_method === 'paypal') {
                req.paymentId = payment.id;
                var redirectUrl;
                console.log(payment);
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
        }
    });
})
app.post("/donatedvalue", function (req, res) {
    let donateamt = req.body.donateamt;
    res.render("donatepay", { donateamt: donateamt })
})
app.get("/donatepay", function (req, res) {
    res.render("donatepay");
})
app.post("/forcheckout", function (req, res) {
    id = req.body.ida;
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find({id:id}).then(result => {
        let i=0;
        // console.log(result[0]);
        var count = Object.keys(result).length;
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, gyms) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        let em = userinfo[0].email;
                                                        res.render("checkout", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, gyms: gyms, imagee: color, name: firstname, email: em, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    // let id = req.body.ida;
    // GymInfo.find().then(result => {
    //     SocialInfo.find().then(result => {
    //         let facebook = result[0].facebook;
    //         let instagram = result[0].instagram;
    //         let twitter = result[0].twitter;
    //         let pintrest = result[0].pintrest;
    //         AffilateInfo.find().then(result1 => {
    //             FitnessInfo.find().then(result2 => {
    //                 MoreInfo.find().then(result3 => {
    //                     let app = result3[0].app;
    //                     let why = result2[0].why;
    //                     let training = result2[0].training;
    //                     let tip = result2[0].tip;
    //                     let top1 = result1[0].top1;
    //                     let top2 = result1[0].top2;
    //                     let top3 = result1[0].top3;
    //                     GymInfo.find().then(resultg => {
    //                         UserInfo.find({ _id: `${id}` }).then(resultu => {
    //                             let emaill = result[0].email;
    //                             let name = result[0].name;
    //                             res.render("checkout", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, item: resultu, name: name, email: emaill })
    //                         }).catch(err => console.log(err));
    //                     }).catch(err => console.log(err));
    //                 }).catch(err => console.log(err));
    //             }).catch(err => console.log(err));
    //         }).catch(err => console.log(err));
    //     }).catch(err => console.log(err))
    // }).catch(err => console.log(err));
})


app.post("/checkout3-large", function (req, res) {
    let names = req.body.names;
    let email = req.body.email;
    let id = req.body.ida;
    let total = req.body.total;
    let no = req.body.mno;
    let emails = req.body.emails;
    let plan = req.body.plan;
    console.log(no);
    console.log(total);
    let amount;
    if (parseInt(no) == 4) {
        amount = 1999.99;
    }
    if (parseInt(no) == 5) {
        amount = 2499.99;
    }
    if (parseInt(no) == 6) {
        amount = 2999.99;
    }
    if (parseInt(no) == 7) {
        amount = 3499.99;
    }
    if (parseInt(no) == 8) {
        amount = 3999.99;
    }
    if (parseInt(no) == 9) {
        amount = 4499.99;
    }
    if (parseInt(no) == 10) {
        amount = 4999.99;
    }
    if (parseInt(no) == 11) {
        amount = 5499.99;
    }
    if (parseInt(no) == 12) {
        amount = 5999.99;
    }
    let finalprice;
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        TaxInfo.find().then(result => {
                            finalprice = parseFloat(amount) + parseFloat(amount * result[0].tax / 100);
                            res.render("checkout4", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, finalprice: finalprice, email: email, no: no, plan: plan, names: names, emails: emails, number: 4 })
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

app.post("/checkout3-less", function (req, res) {
    let email = req.body.email;
    let id = req.body.ida;
    let total = req.body.total;
    let no = req.body.mno;
    let plan = req.body.plan;
    let names = req.body.names;
    let emails = req.body.emails;
    console.log(no);
    console.log(total);
    let amount;
    if (parseInt(no) == 4) {
        amount = 499.99;
    }
    if (parseInt(no) == 5) {
        amount = 749.99;
    }
    if (parseInt(no) == 6) {
        amount = 999.99;
    }
    if (parseInt(no) == 7) {
        amount = 1049.99;
    }
    if (parseInt(no) == 8) {
        amount = 1199.99;
    }
    if (parseInt(no) == 9) {
        amount = 1349.99;
    }
    if (parseInt(no) == 10) {
        amount = 1499.99;
    }
    if (parseInt(no) == 11) {
        amount = 1649.99;
    }
    if (parseInt(no) == 12) {
        amount = 1799.99;
    }
    let finalprice;
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        TaxInfo.find().then(result => {
                            finalprice = parseFloat(amount) + parseFloat(amount * result[0].tax / 100);
                            res.render("checkout4", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, finalprice: finalprice, email: email, no: no, plan: plan, names: names, emails: emails, number: 1 })
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

})
app.post("/checkout3-p", function (req, res) {
    let email = req.body.email;
    let id = req.body.ida;
    let total = req.body.total;
    let no = req.body.mno;
    let plan = req.body.plan;
    let names = req.body.names;
    let emails = req.body.emails;
    let number = req.body.number;
    console.log(no);
    console.log(total);
    let amount;
    if (parseInt(no) == 5) {
        amount = 249.99;
    }
    if (parseInt(no) == 6) {
        amount = 299.99;
    }
    if (parseInt(no) == 7) {
        amount = 349.99;
    }
    if (parseInt(no) == 8) {
        amount = 399.99;
    }
    if (parseInt(no) == 9) {
        amount = 449.99;
    }
    if (parseInt(no) == 10) {
        amount = 499.99;
    }
    if (parseInt(no) == 11) {
        amount = 549.99;
    }
    if (parseInt(no) == 12) {
        amount = 599.99;
    }
    let finalprice;
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        TaxInfo.find().then(result => {
                            finalprice = parseFloat(amount) + parseFloat(amount * result[0].tax / 100);
                            res.render("checkout4", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, finalprice: finalprice, email: email, no: no, plan: plan, names: names, emails: emails })
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

})
app.get("/checkout3-p", function (req, res) {
    let no = req.body.no;
    let plan = req.body.plan;
    let id = req.body.ida;
    let names = req.body.names;
    let emails = req.body.emails;
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        res.render("checkout3-p", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, plan: plan, no: no, names: names, emails: emails })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

app.get("/payment", function (req, res) {
    UserInfo.updateMany({ firstname: "goku" }, {
        $set:
        {
            "img": {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        }
    }).then(result => {
        console.log(result);
    })
    res.render("payment");
})

app.post("/checkout2", function (req, res) {
    let names = req.body.names;
    let emails = req.body.emails;
    let id = req.body.ida;
    let plan = req.body.plan;
    let value = req.body.value;
    let email = req.body.email;
    console.log("processing");
    adminInfo.find().then(setmax => {
        let less =parseInt(setmax[0].less);
        let large = parseInt(setmax[0].large);

    if (plan == "personal") {
        console.log("true");
        SocialInfo.find().then(result => {
            let facebook = result[0].facebook;
            let instagram = result[0].instagram;
            let twitter = result[0].twitter;
            let pintrest = result[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        GymInfo.find().then(resultg => {
                            res.render("checkout3-p", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan, names: names, emails: emails })
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
    else {
        if (plan == "less") {
            adminInfo.find().then(valuee => {
            if (value < valuee[0].less) {
                SocialInfo.find().then(result => {
                    let facebook = result[0].facebook;
                    let instagram = result[0].instagram;
                    let twitter = result[0].twitter;
                    let pintrest = result[0].pintrest;
                    AffilateInfo.find().then(result1 => {
                        FitnessInfo.find().then(result2 => {
                            MoreInfo.find().then(result3 => {
                                let app = result3[0].app;
                                let why = result2[0].why;
                                let training = result2[0].training;
                                let tip = result2[0].tip;
                                let top1 = result1[0].top1;
                                let top2 = result1[0].top2;
                                let top3 = result1[0].top3;
                                GymInfo.find().then(resultg => {
                                    res.render("checkout3-less", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan, names: names, emails: emails })
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
            else {
                res.render("wrong");
            }
        }).catch(err => console.log(err));

        }
        else {
            adminInfo.find().then(valuee => {
            if (value < valuee[0].large) {
                SocialInfo.find().then(result => {
                    let facebook = result[0].facebook;
                    let instagram = result[0].instagram;
                    let twitter = result[0].twitter;
                    let pintrest = result[0].pintrest;
                    AffilateInfo.find().then(result1 => {
                        FitnessInfo.find().then(result2 => {
                            MoreInfo.find().then(result3 => {
                                let app = result3[0].app;
                                let why = result2[0].why;
                                let training = result2[0].training;
                                let tip = result2[0].tip;
                                let top1 = result1[0].top1;
                                let top2 = result1[0].top2;
                                let top3 = result1[0].top3;
                                GymInfo.find().then(resultg => {
                                    res.render("checkout3-large", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan, names: names, emails: emails })
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
            else {
                SocialInfo.find().then(result => {
                    let facebook = result[0].facebook;
                    let instagram = result[0].instagram;
                    let twitter = result[0].twitter;
                    let pintrest = result[0].pintrest;
                    AffilateInfo.find().then(result1 => {
                        FitnessInfo.find().then(result2 => {
                            MoreInfo.find().then(result3 => {
                                let app = result3[0].app;
                                let why = result2[0].why;
                                let training = result2[0].training;
                                let tip = result2[0].tip;
                                let top1 = result1[0].top1;
                                let top2 = result1[0].top2;
                                let top3 = result1[0].top3;
                                GymInfo.find().then(resultg => {
                                    res.render("wrong", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan })
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));

        }
    }
}).catch(err => console.log(err));
    // let newarr = [];
    // value=0;
    // for (var i = 0; i < 25; i++) {
    //     value += arr[i];
    // }
})
app.post("/checkout", function (req, res) {
    let id = req.body.ida;
    let firstname = req.body.firstname;
    let last = req.body.lastname;
    let email = req.body.email
    let phoneno = req.body.phoneno
    let address = req.body.address
    let date = req.body.date
    let gender = req.body.gender
    let zipcode = req.body.zipcode
    let ename = req.body.emergencyname
    let ephone = req.body.emergencyphoneno
    let eemail = req.body.emergencyemail
    let apt = req.body.apt
    let password = req.body.password
    let confirmpassword = req.body.confirmpassword
    let bio = req.body.bio;
    let state = req.body.password;
    let city = req.body.city;
    let newuser = new PremumuserInfo({
        firstname: firstname,
        last: last,
        email: email,
        phoneno: phoneno,
        address: address,
        date: date,
        gender: gender,
        zipcode: zipcode,
        emame: ename,
        ephone: ephone,
        eemail: eemail,
        apt: apt,
        password: password,
        confirmpassword: confirmpassword,
        bio: bio,
        state: state,
        city: city
    })
    newuser.save();
    // let email = req.body.email;
    // let password = req.body.password;
    console.log(email);
    UserInfo.find({ email: email }).then(resultg => {
        let i=0;
        let k=0;
        for(var j=0;j<resultg.length;j++){
            if(email ==resultg[j].email){
                k=k+1;
            }
        }
                let emaill = email;
                let firstname = resultg[i].firstname;
                let id = resultg[i]._id;
                console.log(resultg[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, gyms) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else{
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        let em = userinfo[0].email;
                                                        GymInfo.find({ plan: "less" }).then(lessplan => {
                                                            GymInfo.find({ plan: "large" }).then(largeplan => {
                                                                res.render("checkout2", { largeplan:largeplan,lessplan:lessplan,facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, gyms: gyms, imagee: color, name: firstname, email: em, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
            // }
    }).catch(err => console.log(err));
    // UserInfo.find({ email: email }).then(resultg => {
    //     if (password == resultg[0].password) {
    //         if (password == confirmpassword) {
    //             newuser.save();
    //         }
    //     }
    // }).catch(err => console.log(err));

    // SocialInfo.find().then(result => {
    //     let facebook = result[0].facebook;
    //     let instagram = result[0].instagram;
    //     let twitter = result[0].twitter;
    //     let pintrest = result[0].pintrest;
    //     AffilateInfo.find().then(result1 => {
    //         FitnessInfo.find().then(result2 => {
    //             MoreInfo.find().then(result3 => {
    //                 let app = result3[0].app;
    //                 let why = result2[0].why;
    //                 let training = result2[0].training;
    //                 let tip = result2[0].tip;
    //                 let top1 = result1[0].top1;
    //                 let top2 = result1[0].top2;
    //                 let top3 = result1[0].top3;
    //                 GymInfo.find().then(resultg => {
    //                     res.render("checkout2", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id })
    //                 }).catch(err => console.log(err));
    //             }).catch(err => console.log(err));
    //         }).catch(err => console.log(err));
    //     }).catch(err => console.log(err));
    // }).catch(err => console.log(err));
})

app.get("/checkout", function (req, res) {
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("checkout", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3 })
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/signindetails", function (req, res) {
    let firstname = req.body.firstname;
    let last = req.body.lastname;
    let email = req.body.email
    let phoneno = req.body.phoneno
    let address = req.body.address
    let date = req.body.date
    let gender = req.body.gender
    let zipcode = req.body.zipcode
    let ename = req.body.emergencyname
    let ephone = req.body.emergencyphoneno
    let eemail = req.body.emergencyemail
    let apt = req.body.apt
    let password = req.body.password
    let confirmpassword = req.body.confirmpassword
    let bio = req.body.bio;
    let state = req.body.password;
    let city = req.body.city;
    let status = req.body.status;

    let newuser = new UserInfo({
        firstname: firstname,
        last: last,
        email: email,
        phoneno: phoneno,
        address: address,
        date: date,
        gender: gender,
        zipcode: zipcode,
        emame: ename,
        ephone: ephone,
        eemail: eemail,
        apt: apt,
        password: password,
        confirmpassword: confirmpassword,
        bio: bio,
        status:status,
        city:city,
        state:state
    })
    if (password == confirmpassword) {
        newuser.save();
    }


    // let user = req.body.usertag;
    // let value = req.body.ecoprice;
    // EmailInfo.find().then(result => {
    // MassageInfo.find().then(resultt =>{
    //     let message = resultt[0].message;
    //     let emaill = result[0].email;
    //     let shivemail = 'shivamtambe545@gmail.com';
    //     sgMail.setApiKey(process.env.Sendkey)
    //     const msg = {
    //         to:[shivemail,emaill,'shivamstambe20222@gmail.com','empiregaming545@gmail.com'],
    //         from:{
    //             name:"Vonelijah",
    //             email:'shivamtambe545@gmail.com'
    //         },
    //         subject: 'From Vonelijah',
    //         text: `${message}`,
    //         html: `<h1>${message}</h1>`,
    //     }
    //     sgMail
    //         .send(msg)
    //         .then(() => {
    //         console.log('Email sent')
    //         })
    //         .catch((error) => {
    //         console.error(error)
    //         })
    // }).catch(err => console.log(err));
    // }).catch(err => console.log(err));
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultg => {
                        res.render("login", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
    // console.log(user);
    // console.log(value);
    // if(user == "Personal"){
    //     res.redirect("https://buy.stripe.com/test_14k5kkcbjbOH6kg5kt");
    // }else{
    //     if(parseInt(value) == -1){
    //         res.render("wrong");
    //     }
    //     else{
    //         res.redirect("https://buy.stripe.com/test_dR6dQQejrbOHbEA14e");
    //     }
    // }
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


app.post("/loginedgyms", function (req, res) {
    id = req.body.ida;
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find({id:id}).then(result => {
        let i=0;
        // console.log(result[0]);
        var count = Object.keys(result).length;
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, gyms) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        let em = userinfo[0].email;
                                                        res.render("loginedgym", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, gyms: gyms, imagee: color, name: firstname, email: em, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.post("/personaltrainer", function (req, res) {
    id = req.body.ida;
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find({id:id}).then(result => {
        let i=0;
        // console.log(result[0]);
        var count = Object.keys(result).length;
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(firstname);
                console.log(result[i].firstname);
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, gyms) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        UserInfo.find({plan:"personal"}).then(personal => {
                                                            UserInfo.find({ status: "Public" }).then(public => {
                                                                let em = userinfo[0].email;
                                                                res.render("personaltrainer", {personal: personal, public: public, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, gyms: gyms, imagee: color, name : firstname, email: em, id: id, userinfo: userinfo })
                                                            }).catch(err => console.log(err));
                                                        }).catch(err => console.log(err));
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/gyms", function (req, res) {
    GymInfo.find().then(result => {
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        res.render("index", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.post("/gymfullinfo", function (req, res) {
    let id = req.body.ida;
    GymInfo.find().then(result => {
        SocialInfo.find().then(result => {
            let facebook = result[0].facebook;
            let instagram = result[0].instagram;
            let twitter = result[0].twitter;
            let pintrest = result[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        GymInfo.find().then(resultg => {
                            UserInfo.find({ _id: `${id}` }).then(resultu => {
                                let emaill = result[0].email;
                                let name = result[0].name;
                                res.render("checkout", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, id: id, item: resultu, name: name, email: emaill })
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    }).catch(err => console.log(err));
})


app.post("/loginedhome", function (req, res) {
    id = req.body.ida;
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find({id:id}).then(result => {
        let i=0;
        // console.log(result[0]);
        var count = Object.keys(result).length;
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(more => {
                    console.log(other);
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, resultt) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                OtherInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        let em = userinfo[0].email;
                                                        res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: more, items: items, itemm: resultt, imagee: color, name: firstname, email: em, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/sendphysical", function (req, res) {
    let number = req.body.number;
    console.log(number);
    let num = number - 1;
    let id = req.body.ida;
    console.log("ID IS");
    console.log(id);
    let plan = req.query.plan;
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            payInfo.find({ email: `${email}` }).then(selectedGyms => {
                                if (num > 0) {
                                    payInfo.updateOne({ email: `${email}` }, {
                                        $set: {
                                            number: num
                                        }
                                    }).then(resultt => {
                                        let shivemail = 'shivamtambe545@gmail.com';
                                        sgMail.setApiKey(process.env.Sendkey)
                                        const msg = {
                                            to: [mainmail],
                                            from: {
                                                name: "Vonelijah",
                                                email: 'shivamtambe545@gmail.com'
                                            },
                                            subject:`Request about Physical Therapy`,
                                            text: `Request for Physical Therapy from ${email}`,
                                            html: `<h1>Request for Physical Therapy from ${email}</h1>`,
                                        }
                                        sgMail
                                            .send(msg)
                                            .then(() => {
                                                console.log('Email sent')
                                            })
                                            .catch((error) => {
                                                console.error(error)
                                            })
                                        let number = selectedGyms[0].number;
                                        if (selectedGyms.length == 0) {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: number });
                                            }, 3000);
                                        } else {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                            }, 3000);
                                        }
                                    });
                                    console.log(selectedGyms[0].names);
                                } else {
                                    payInfo.updateOne({ email: `${email}` }, {
                                        $set: {
                                            number: number
                                        }
                                    }).then(resultt => {
                                        let number = selectedGyms[0].number;
                                        if (selectedGyms.length == 0) {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: number });
                                            }, 3000);
                                        } else {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                            }, 3000);
                                        }
                                    });
                                    console.log(selectedGyms[0].names);
                                }
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/physical", function (req, res) {
    let number = req.body.number;
    console.log(number);
    let num = number - 1;
    number = number - 1;
    let id = req.body.ida;
    console.log("ID IS");
    console.log(id);
    let plan = req.query.plan;
    UserInfo.find({ _id: `${id}` }).then(result => {
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            payInfo.find({ email: `${email}` }).then(selectedGyms => {
                                if (num >= 0) {
                                    payInfo.updateOne({ email: `${email}` }, {
                                        $set: {
                                            number: num
                                        }
                                    }).then(resultt => {
                                        // let number = selectedGyms[0].number;
                                        if (selectedGyms.length == 0) {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: -1 });
                                            }, 3000);
                                        } else {
                                            setTimeout(() => {
                                                res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                            }, 3000);
                                        }
                                    });
                                } else {
                                    // let number = selectedGyms[0].number;
                                    if (selectedGyms.length == 0) {
                                        setTimeout(() => {
                                            res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: -1 });
                                        }, 3000);
                                    } else {
                                        setTimeout(() => {
                                            res.render("physical", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                        }, 3000);
                                    }
                                }
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/sendmassage", function (req, res) {
    let number = req.body.number;
    console.log(number);
    let num = number - 1;
    number = number - 1;
    let id = req.body.ida;
    console.log("ID IS");
    console.log(id);
    let plan = req.query.plan;
    EmailInfo.find().then(mainemail => {
        let mainmail = mainemail[0].email;
        UserInfo.find({ _id: `${id}` }).then(result => {
            // console.log(result);
            // console.log(result[0].name);
            let name = result[0].firstname;
            let email = result[0].email;
            let identity = result[0].identity;
            SocialInfo.find().then(resulta => {
                let facebook = resulta[0].facebook;
                let instagram = resulta[0].instagram;
                let twitter = resulta[0].twitter;
                let pintrest = resulta[0].pintrest;
                AffilateInfo.find().then(result1 => {
                    FitnessInfo.find().then(result2 => {
                        MoreInfo.find().then(result3 => {
                            let app = result3[0].app;
                            let why = result2[0].why;
                            let training = result2[0].training;
                            let tip = result2[0].tip;
                            let top1 = result1[0].top1;
                            let top2 = result1[0].top2;
                            let top3 = result1[0].top3;
                            UserInfo.find({ _id: `${id}` }).then(userinfo => {
                                payInfo.find({ email: `${email}` }).then(selectedGyms => {
                                    if (num >= 0) {
                                        sgMail.setApiKey(process.env.Sendkey)
                                        const msg = {
                                            to: [mainmail],
                                            from: {
                                                name: "Vonelijah",
                                                email: 'shivamtambe545@gmail.com'
                                            },
                                            subject:`Request about Massage`,
                                            text: `Request for Massage from ${email}`,
                                            html: `<h1>Request for Massage from ${email}</h1>`,
                                        }
                                        sgMail
                                            .send(msg)
                                            .then(() => {
                                                console.log('Email sent')
                                            })
                                            .catch((error) => {
                                                console.error(error)
                                            })
                                        payInfo.updateOne({ email: `${email}` }, {
                                            $set: {
                                                number: num
                                            }
                                        }).then(resultt => {
                                            let number = selectedGyms[0].number;
                                            if (selectedGyms.length == 0) {
                                                setTimeout(() => {
                                                    res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: number });
                                                }, 3000);
                                            } else {
                                                setTimeout(() => {
                                                    res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                                }, 3000);
                                            }
                                        });
                                        console.log(selectedGyms[0].names);
                                    } else {
                                        let number = selectedGyms[0].number;
                                        if (selectedGyms.length == 0) {
                                            setTimeout(() => {
                                                res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: number });
                                            }, 3000);
                                        } else {
                                            setTimeout(() => {
                                                res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: number });
                                            }, 3000);
                                        }
                                        console.log(selectedGyms[0].names);
                                    }
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/massage", function (req, res) {
    let id = req.body.ida;
    console.log("ID IS");
    console.log(id);
    let plan = req.query.plan;
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            payInfo.find({ email: `${email}` }).then(selectedGyms => {
                                if (selectedGyms.length == 0) {
                                    res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"], id: id, number: -1 });
                                } else {
                                    res.render("massage", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names, id: id, number: selectedGyms[0].number });
                                }
                                console.log(selectedGyms[0].names);
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.get("/settinggymschange", function (req, res) {
    let names = req.body.names;
    let id = req.body.id;
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ email: `${email}` }).then(userinfo => {
                            payInfo.updateOne({ email: `${email}` }, {
                                $set: {
                                    names: names
                                }
                            }).then(resultt => {
                                res.render("settinggyms", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, plan: plan[0].plan, names: names });
                            });
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.get("/work", function (req, res) {
    res.render("worke");
})
app.get("/settinggymschange", function (req, res) {
    let id = req.query.id;
    let plan = req.query.plan;
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ email: `${email}` }).then(userinfo => {
                            payInfo.find().then(plan => {
                                res.render("settinggymschange", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, plan: plan[0].plan, names: names });
                            }).catch(err => console.log(err));

                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/payingforchange", function (req, res) {
    id = req.body.id;
    let names = req.body.names;
    let plan = req.body.plan;
    var payment = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": app.locals.baseurl + `/settinggymschange?id=${id}&plan=${plan}`,
            "cancel_url": app.locals.baseurl + "/cancel"
        },
        "transactions": [{
            "amount": {
                "total": 50,
                "currency": "USD"
            },
            "description": "Changes the gyms"
        }]
    };
    paypal.payment.create(payment, function (error, payment) {
        if (error) {
            console.log(error);
        } else {
            if (payment.payer.payment_method === 'paypal') {
                req.paymentId = payment.id;
                var redirectUrl;
                console.log(payment);
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            }
        }
    });
})
app.post("/payforedit", function (req, res) {
    let value = req.body.value;
    names = req.body.gymname;
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ email: `${email}` }).then(userinfo => {
                            payInfo.find({ email: `${email}` }).then(plan => {
                                let plan1 = plan[0].plan;
                                if (plan == "less") {
                                    if (value < 500) {
                                        res.render("payforedit", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, plan: plan[0].plan, names: names });
                                    }
                                    else {
                                        res.render("wrong", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan })
                                    }
                                } else {
                                    if (plan == "large") {
                                        if (value < 1500) {
                                            res.render("payforedit", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, plan: plan[0].plan, names: names });
                                        }
                                        else {
                                            res.render("wrong", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, gyms: resultg, email: email, id: id, plan: plan })
                                        }
                                    }
                                }

                            }).catch(err => console.log(err));

                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/changegyms", function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            GymInfo.find().then(gyms => {
                                res.render("changegyms", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, gyms: gyms });
                            }).catch(err => console.log(err));

                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/settinggyms", function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        // console.log(result);
        // console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            payInfo.find({ email: `${email}` }).then(selectedGyms => {
                                if (selectedGyms.length == 0) {
                                    res.render("settinggyms", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: ["hey"] });
                                } else {
                                    res.render("settinggyms", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, selectedGyms: selectedGyms[0].names });
                                }
                                console.log(selectedGyms[0].names);
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/editphoto", upload.single('image'), function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        console.log(result);
        console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            UserInfo.updateOne({ _id: `${id}` }, {
                                $set: {
                                    img: {
                                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                                        contentType: 'image/png'
                                    }
                                }
                            }).then(resultt => {
                                res.render("photo", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo });
                            });
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.post("/photo", function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        console.log(result);
        console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;
        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            res.render("photo", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo });
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})
app.get("/loginedhome", function (req, res) {
    MoreInfo.find().then(resultm => {
        imgModel.find({}, (err, itemsi) => {
            gymLogo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    UserInfo.find().then(user => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('An error occurred', err);
                        }
                        else {
                            res.render("loginedhome", { item: resultm, items: itemsi, itemm: resultt, imagee: color, user: user });
                        }
                    });
                });
            });
        });
    }).catch(err => console.log(err));
})

app.post("/loginedpricing", function (req, res) {
    id = req.body.ida;
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find({id:id}).then(result => {
        let i=0;
        // console.log(result[0]);
        var count = Object.keys(result).length;
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(result => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, gyms) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        let em = userinfo[0].email;
                                                        PricingInfo1.find().then(ecogyms => {
                                                            PricingInfo2.find().then(pregyms =>{
                                                        res.render("loginedpricing", {ecogyms:ecogyms[0],pregyms:pregyms[0], facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, gyms: gyms, imagee: color, name: firstname, email: em, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                                }).catch(err => console.log(err));
                                            }).catch(err => console.log(err));
                                        }).catch(err => console.log(err));
                                    }).catch(err => console.log(err));
                                }
                            });
                        });
                    });
                }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/signin", function (req, res) {
    console.log("hhhh");
    // let shivemail = 'shivamtambe545@gmail.com';
    // sgMail.setApiKey(process.env.Sendkey)
    // const msg = {
    //     to:[shivemail,'shivamstambe20222@gmail.com','empiregaming545@gmail.com'],
    //     from:{
    //         name:"Vonelijah",
    //         email:'shivamtambe545@gmail.com'
    //     },
    //     subject: 'Sending with SendGrid is Fun',
    //     text: 'and easy to do anywhere, even with Node.js',
    //     html: '<h1>Another Mail</h1>',
    //   }
    //   sgMail
    //     .send(msg)
    //     .then(() => {
    //       console.log('Email sent')
    //     })
    //     .catch((error) => {
    //       console.error(error)
    //     })
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    GymInfo.find().then(resultgym => {
                        res.render("signup", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: resultgym })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/twopricing", function (req, res) {
    // let newpaid = new PaidInfo({
    //     names :"Massage Envy",
    //     gymsemails  : "email@gmail.com"
    // })
    // newinfo.save();
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("twopricing", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3 })
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/normaltrainer", function (req, res) {
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("normaltrainer", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3 })
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/pricing", function (req, res) {

    // let affi = new AffilateInfo({
    //     top1:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     top2:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642",
    //     top3:"https://search.yahoo.com/search;_ylt=Awr98NsoKmZjciIHbMdXNyoA;_ylu=Y29sbwNncTEEcG9zAzEEdnRpZAMEc2VjA3Fydw--?type=E211US885G0&fr=mcafee&ei=UTF-8&p=affiliates&fr2=12642"
    // })
    // affi.save();
    // let fit = new PricingInfo1({
    //     first:"HELLO"
    // })
    // fit.save();
    // let other = new PricingInfo2({
    //     first:"WIRkd"
    // })
    // other.save();
    //
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    PricingInfo1.find().then(ecogyms => {
                        PricingInfo2.find().then(pregyms => {
                            res.render("pricing", {ecogyms:ecogyms[0],pregyms:pregyms[0], facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3 })
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

app.get("/home", function (req, res) {
    MoreInfo.find().then(result => {
        imgModel.find({}, (err, items) => {
            gymLogo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('An error occurred', err);
                    }
                    else {
                        SocialInfo.find().then(result => {
                            let facebook = result[0].facebook;
                            let instagram = result[0].instagram;
                            let twitter = result[0].twitter;
                            let pintrest = result[0].pintrest;
                            AffilateInfo.find().then(result1 => {
                                FitnessInfo.find().then(result2 => {
                                    MoreInfo.find().then(result3 => {
                                        let app = result3[0].app;
                                        let why = result2[0].why;
                                        let training = result2[0].training;
                                        let tip = result2[0].tip;
                                        let top1 = result1[0].top1;
                                        let top2 = result1[0].top2;
                                        let top3 = result1[0].top3;
                                        res.render("home", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, itemm: resultt, imagee: color })
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
app.get("/", function (req, res) {
    MoreInfo.find().then(result => {
        imgModel.find({}, (err, items) => {
            GymInfo.find({}, (err, resultt) => {
                color.find({}, (err, color) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('An error occurred', err);
                    }
                    else {
                        SocialInfo.find().then(resulta => {
                            let facebook = resulta[0].facebook;
                            let instagram = resulta[0].instagram;
                            let twitter = resulta[0].twitter;
                            let pintrest = resulta[0].pintrest;
                            AffilateInfo.find().then(result1 => {
                                FitnessInfo.find().then(result2 => {
                                    MoreInfo.find().then(result3 => {
                                        let app = result3[0].app;
                                        let why = result2[0].why;
                                        let training = result2[0].training;
                                        let tip = result2[0].tip;
                                        let top1 = result1[0].top1;
                                        let top2 = result1[0].top2;
                                        let top3 = result1[0].top3;
                                        res.render("home", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, items: items, itemm: resultt, imagee: color })
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
app.get("/signup", function (req, res) {
    SocialInfo.find().then(resulta => {
        let facebook = resulta[0].facebook;
        let instagram = resulta[0].instagram;
        let twitter = resulta[0].twitter;
        let pintrest = resulta[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("login", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3 })
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

app.post("/signup", function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log(email);
    UserInfo.find().then(result => {
        // console.log(result[0]);
        var count = Object.keys(result).length;
        for (var i = 0; i < count; i++) {
            if (password == result[i].password && email == result[i].email) {
                let emaill = email;
                console.log(result[i]._id);
                let firstname = result[i].firstname;
                let id = result[i]._id;
                let num = result[i].number;
                let servicee = result[i].servicee;
                console.log(servicee);
                console.log(result[i].number);
                MoreInfo.find().then(more => {
                    imgModel.find({}, (err, items) => {
                        GymInfo.find({}, (err, resultt) => {
                            color.find({}, (err, color) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).send('An error occurred', err);
                                }
                                else {
                                    let obj = [];
                                    SocialInfo.find().then(result => {
                                        let facebook = result[0].facebook;
                                        let instagram = result[0].instagram;
                                        let twitter = result[0].twitter;
                                        let pintrest = result[0].pintrest;
                                        AffilateInfo.find().then(result1 => {
                                            FitnessInfo.find().then(result2 => {
                                                MoreInfo.find().then(result3 => {
                                                    let app = result3[0].app;
                                                    let why = result2[0].why;
                                                    let training = result2[0].training;
                                                    let tip = result2[0].tip;
                                                    let top1 = result1[0].top1;
                                                    let top2 = result1[0].top2;
                                                    let top3 = result1[0].top3;
                                                    UserInfo.find({ _id: id }).then(userinfo => {
                                                        console.log(firstname);
                                                        res.render("loginedhome", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: more, items: items, itemm: resultt, imagee: color, name: firstname, email: emaill, id: id, userinfo: userinfo })
                                                    }).catch(err => console.log(err));
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
})
app.post("/promo", function (req, res) {
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({ promocode: `${promocodee}` }).then(result => {
        console.log(result);
        console.log(result[0].value);
        res.render('promoprice', { value1: result[0].value });
    }).catch(err => console.log(err));
})

app.post("/promo2", function (req, res) {
    let promocodee = req.body.promocode;
    console.log(promocodee);
    PromoInfo.find({ promocode: `${promocodee}` }).then(result => {
        res.render('promoprice', { value1: result[0].value });
    }).catch(err => console.log(err));
})


app.post("/searchbyname", function (req, res) {
    let name = req.body.username;
    PersonalTrainer.find({ trainername: `${name}` }).then(result => {
        console.log(result[0].trainername);
        UserInfo.find().then(resultt => {
            // console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbycity", function (req, res) {
    let name = req.body.usercity;
    PersonalTrainer.find({ city: `${name}` }).then(result => {
        UserInfo.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbystate", function (req, res) {
    let name = req.body.userstate;
    PersonalTrainer.find({ state: `${name}` }).then(result => {
        UserInfo.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbyzip", function (req, res) {
    let name = req.body.userzip;
    PersonalTrainer.find({ zipcode: `${name}` }).then(result => {
        UserInfo.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})


app.post("/searchbynamee", function (req, res) {
    let name = req.body.username;
    console.log(name);
    UserInfo.find({ name: `${name}` }).then(result => {
        console.log(result);
        PersonalTrainer.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: resultt, public: result });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbycityy", function (req, res) {
    let name = req.body.usercity;
    UserInfo.find({ city: `${name}` }).then(result => {
        PersonalTrainer.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbystatee", function (req, res) {
    let name = req.body.userstate;
    UserInfo.find({ state: `${name}` }).then(result => {
        PersonalTrainer.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.post("/searchbyzipp", function (req, res) {
    let name = req.body.userzip;
    UserInfo.find({ zipcode: `${name}` }).then(result => {
        PersonalTrainer.find().then(resultt => {
            console.log(resultt);
            res.render('personaltrainer', { item: result, item1: resultt });
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
app.get("/payallathe", function (req, res) {
    SocialInfo.find().then(result => {
        let facebook = result[0].facebook;
        let instagram = result[0].instagram;
        let twitter = result[0].twitter;
        let pintrest = result[0].pintrest;
        AffilateInfo.find().then(result1 => {
            FitnessInfo.find().then(result2 => {
                MoreInfo.find().then(result3 => {
                    let app = result3[0].app;
                    let why = result2[0].why;
                    let training = result2[0].training;
                    let tip = result2[0].tip;
                    let top1 = result1[0].top1;
                    let top2 = result1[0].top2;
                    let top3 = result1[0].top3;
                    res.render("payallathe", { facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, imagee: color })
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})




app.post("/services", function (req, res) {
    let id = req.body.idb;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        console.log(result);
        console.log(result[0].name);
        let name = result[0].name;
        let email = result[0].email;
        let identity = result[0].identity;
        res.render("servics", { name: name, email: email, identity: identity, result: result[0] });
    });
})

app.post("/editedsetting", function (req, res) {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let phoneno = req.body.phoneno;
    let bio = req.body.bio;
    let date = req.body.date;
    let gender = req.body.gender;
    let city = req.body.city;
    let state = req.body.state;
    let address = req.body.address;
    let zipcode = req.body.zipdcode;
    let apt = req.body.apt;
    let ename = req.body.ename;
    let eemail = req.body.eemail;
    let ephone = req.body.ephone;
    let status = req.body.status;
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        UserInfo.updateOne({ _id: `${id}` }, {
            $set:
            {
                firstname: first,
                last: last,
                phoneno: phoneno,
                address: address,
                date: date,
                gender: gender,
                zipcode: zipcode,
                ename: ename,
                ephone: ephone,
                eemail: eemail,
                apt: apt,
                state: state,
                city: city,
                status:status
            }
        }).then(resuhlt => {
            console.log(result);


            let name = result[0].firstname;
            console.log(result[0].name);
            let email = result[0].email;
            let identity = result[0].identity;
            SocialInfo.find().then(resulta => {
                let facebook = resulta[0].facebook;
                let instagram = resulta[0].instagram;
                let twitter = resulta[0].twitter;
                let pintrest = resulta[0].pintrest;
                AffilateInfo.find().then(result1 => {
                    FitnessInfo.find().then(result2 => {
                        MoreInfo.find().then(result3 => {
                            let app = result3[0].app;
                            let why = result2[0].why;
                            let training = result2[0].training;
                            let tip = result2[0].tip;
                            let top1 = result1[0].top1;
                            let top2 = result1[0].top2;
                            let top3 = result1[0].top3;
                            UserInfo.find({ _id: `${id}` }).then(userinfo => {
                                res.render("profiledit", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo });
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                console.log(result);
            })
        }).catch(err => console.log(err));
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
    
        let phoneno = req.body.phoneno;
        let date = req.body.date;
        let gender = req.body.gender;
        let city = req.body.city;
        let state = req.body.state;
        let address = req.body.address;
        let zipcode = req.body.zipdcode;
        let apt = req.body.apt;
        let ename = req.body.ename;
        let eemail = req.body.eemail;
        let ephone = req.body.ephone;
    var obj = {
        first: req.body.first,
        last: req.body.last,
        bio: req.body.bio,
        email: req.body.email,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    UserInfo.updateOne({ _id: `${id}` }, {
        
        $set: {
            firstname: first,
                last: last,
                phoneno: phoneno,
                address: address,
                date: date,
                gender: gender,
                zipcode: zipcode,
                ename: ename,
                ephone: ephone,
                eemail: eemail,
                apt: apt,
                state: state,
                city: city,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            status: sta
            
        }
    }).then(resultt => {
        UserInfo.find({ _id: `${id}` }).then(result => {
            console.log(result);
            console.log(result[0].name);
            let name = result[0].name;
            let email = result[0].email;
            let identity = result[0].identity;
        });
        let first = req.body.first;
        let last = req.body.last;
        let email = req.body.email;
        let phoneno = req.body.phoneno;
        let bio = req.body.bio;
        let date = req.body.date;
        let gender = req.body.gender;
        let city = req.body.city;
        let state = req.body.state;
        let address = req.body.address;
        let zipcode = req.body.zipdcode;
        let apt = req.body.apt;
        let ename = req.body.ename;
        let eemail = req.body.eemail;
        let ephone = req.body.ephone;
        id = req.body.ida;
        console.log(id);
        UserInfo.find({ _id: `${id}` }).then(result => {
            UserInfo.updateOne({ _id: `${id}` }, {
                $set:
                {
                    firstname: first,
                    last: last,
                    phoneno: phoneno,
                    address: address,
                    date: date,
                    gender: gender,
                    zipcode: zipcode,
                    ename: ename,
                    ephone: ephone,
                    eemail: eemail,
                    apt: apt,
                    state: state,
                    city: city
                }
            }).then(resuhlt => {
                console.log(result);


                let name = result[0].firstname;
                console.log(result[0].name);
                let email = result[0].email;
                let identity = result[0].identity;
                SocialInfo.find().then(resulta => {
                    let facebook = resulta[0].facebook;
                    let instagram = resulta[0].instagram;
                    let twitter = resulta[0].twitter;
                    let pintrest = resulta[0].pintrest;
                    AffilateInfo.find().then(result1 => {
                        FitnessInfo.find().then(result2 => {
                            MoreInfo.find().then(result3 => {
                                let app = result3[0].app;
                                let why = result2[0].why;
                                let training = result2[0].training;
                                let tip = result2[0].tip;
                                let top1 = result1[0].top1;
                                let top2 = result1[0].top2;
                                let top3 = result1[0].top3;
                                UserInfo.find({ _id: `${id}` }).then(userinfo => {
                                    res.render("setting", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, id: id });
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                    console.log(result);
                })
            }).catch(err => console.log(err));
        });
    });
})

app.post("/editp", function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        console.log(result[0].name);
        let name = result[0].name;
        let email = result[0].email;
        let identity = result[0].identity;

        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        res.render("profiledit", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, item: result, imagee: color });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})


app.post("/setting", function (req, res) {
    id = req.body.ida;
    console.log(id);
    UserInfo.find({ _id: `${id}` }).then(result => {
        console.log(result);
        console.log(result[0].name);
        let name = result[0].firstname;
        let email = result[0].email;
        let identity = result[0].identity;

        SocialInfo.find().then(resulta => {
            let facebook = resulta[0].facebook;
            let instagram = resulta[0].instagram;
            let twitter = resulta[0].twitter;
            let pintrest = resulta[0].pintrest;
            AffilateInfo.find().then(result1 => {
                FitnessInfo.find().then(result2 => {
                    MoreInfo.find().then(result3 => {
                        let app = result3[0].app;
                        let why = result2[0].why;
                        let training = result2[0].training;
                        let tip = result2[0].tip;
                        let top1 = result1[0].top1;
                        let top2 = result1[0].top2;
                        let top3 = result1[0].top3;
                        UserInfo.find({ _id: `${id}` }).then(userinfo => {
                            let para = userinfo.img;
                            res.render("setting", { name: name, email: email, identity: identity, result: result[0], items: result, facebook: facebook, instagram: instagram, twitter: twitter, pintrest: pintrest, app: app, why: why, training: training, tip: tip, top1: top1, top2: top2, top3: top3, userinfo: userinfo, para: para });
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
})

// app.get("/setting", function (req, res) {
//     id = req.body.ida;
//     console.log(id);
// UserInfo.find({_id:`${id}`}).then(result =>{

// })
//     res.render("setting");
// })

app.listen(port, function () {
    console.log("server is running on prot " + port);
})