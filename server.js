var https=require("https");
var express=require("express");
var app=express();
var fs=require("fs");
var expSession=require("express-session");
var server=https.createServer({
    key:fs.readFileSync("backend/ssl/server.key"),
    cert:fs.readFileSync("backend/ssl/server.crt")
},app);
var login=require("./backend/router/login");
var login_check=require("./backend/router/login_check");

var bodyParser=require("body-parser");
app.use(express.static("./"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/',login_check);
app.use('/user',login);

app.use(expSession({
    secret:'LowesYang',
    key:'123456',
    resave:false,
    saveUninitialized:true
}));

app.listen("2000");
server.listen("2016");