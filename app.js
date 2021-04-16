var express        = require("express"),
    methodoverride = require("method-override"),
    bodyparser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    user           = require("./models/user");
    var multer = require('multer');
    path = require('path');
    var fs = require('fs');

var app = express();
app.use(methodoverride( "_method"))
app.use(bodyparser.urlencoded({extended : true}));
app.set("view engine" , "ejs");

mongoose.connect("mongodb+srv://dbvb:dbvb@cluster-xqcoa.mongodb.net/test?retryWrites=true&w=majority" , {useUnifiedTopology : true , useNewUrlParser: true , useCreateIndex: true} , 
()=>{
    console.log("MongoDB Connected")
});

app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret : "form",
    resave : false,
    saveUninitialized : false
}));

app.use(function(req , res , next){
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.get("/" , (req , res)=> {
    user.find({}, (err , created)=>{
    res.render("form" , {data : created})
     })
})

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname+ "-"+Date.now()+path.extname( file.originalname ))
    }
  })
   
  var upload = multer({ storage: storage })

app.post("/form_submit", upload.single('file') , (req , res)=>{
    console.log(req.file) 
    if(req.file){
    req.body.file = req.file.path
    }
    user.create(req.body , (err , created)=>{
        console.log(created)
        
        res.redirect("/")
    })
})

app.post("/edit_data" , (req , res)=>{
    console.log(req.body)

    obj = {
        name : req.body.name,
        email : req.body.email,
        date : req.body.date,
        number : req.body.number,
        stream : req.body.stream.toLowerCase()
    }

    console.log(obj)
    user.updateOne({_id : req.body.delobj}, {"$set" : obj} , (err , del)=>{
        if(err) throw err
        console.log(del)
    })

    res.redirect('back')
})

app.post('/delete_product'  , (req , res)=>{

    console.log(req.body)

    user.findOne({_id : req.body.delobj} , (err , fnd)=>{
        var filepath = fnd.file
        fs.unlinkSync(filepath)
    })

    user.findOneAndDelete({_id : req.body.delobj} , (err , del)=>{
        console.log(del)
    })

    res.redirect('back')
})


app.listen("3000" , (req , res)=>{
    console.log("App Server Started......")
})