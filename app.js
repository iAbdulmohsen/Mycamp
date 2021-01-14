var express = require("express");
var app = express();
app.set("view engine", "ejs")
var Camp = require("./models/campground") // Camp name of the modle , this that function of moongoos use it
var comment = require("./models/comment");
var user = require("./models/user")
var seedDB = require("./seeds")
var methodOverride = require("method-override")
var flash = require("connect-flash");
app.locals.moment = require("moment");

var passport              = require("passport"),
 localStrategy            = require("passport-local"),
 passportLocalMongoose    = require("passport-local-mongoose");


var campRouts = require("./routs/camp");
var commentRouts = require("./routs/comment");
var authRouts = require("./routs/auth");

// seedDB();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
var mongoose = require("mongoose"); //لازم نفس الأسم 
const { serializeUser } = require("passport");
// ======================================================
// mongoose.connect("mongodb://localhost:27017/mycamp", {useNewUrlParser: true,useUnifiedTopology: true,}) //conect locally
// .then(() => console.log("Connected to DB!"))
//   .catch((error) => console.log(error.message));


// enveirment devloeper 
// يعني اذا اتصلت باللوكل هوست تصصل بدتا بيس اللوكل هوست واذا دخلت عن طريق هروكو تتصل بداتا بيس الي مونقو اطلس الاساسيه المنشوره في الموقع الاصلي شكراً
var url = process.env.DATABASEURL || "mongodb://localhost:27017/mycamp" ;
mongoose.connect(url);



// mongoose.connect(
//       "mongodb+srv://mycamp:hotmail.com@cluster0.c0jtx.mongodb.net/mycamp?retryWrites=true&w=majority",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         userCreateIndex: true,
//       }
//     )
//     .then(() => console.log("Connected to DB!"))
//     .catch((error) => console.log(error.message)); //concet wiht altals

// =========================================================
// Passport configuration
app.use(
  require("express-session")({
    secret: "shibas are the best dogs in the world.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req , res , next){ // هذه الداله تشتغل على كل روات الي هو تمبلت كـ مديل وير 
  res.locals.therUser =  req.user
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
}) // اقدر استخدمه علي اي تملبلت

app.use(campRouts); //app.use("/campground" , campRouts); - تحذف في ملف الكامبقراوند /campgrounds  - مجرد أختصار
app.use(commentRouts);
app.use(authRouts);

app.get("/",function(req , res){
    res.render("landing")
})






// to run in heroku 
app.listen(process.env.PORT || 5000); 

// to tun locally
app.listen("3000", function(){
    console.log("YelpCamp is Started At 3000 port , Secssefully");
})




  // <%- include("partials/header") %>
  // <% - include("partials/footer") %>