const conf = require("./src/conf/conf");
const debug = require("./src/debug/debug");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./src/routes/routes");
const check_jwt = require("express-jwt");

/**
 * Creating Express Application
 */
let app = express();



/**
 * Creating a database connection
 */

mongoose.Promise = global.Promise;
let connection = mongoose.connect(conf.database.url, {});
connection.catch(err=>{
    console.log(err.message);
    process.exit(1);
});

/**
 * Middlewares
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",  req.header("Access-Control-Request-Headers"));
    res.header("Access-Control-Allow-Methods","POST, PUT, GET, OPTIONS");
    next();
});
app.use(check_jwt({secret: conf.jwt_secret}).unless({ path: ["/register", "/login", "/verify"]}));
app.use((err,req,res,next)=>{
    if(err){
        console.log(err.message);
        res.status(200).json({"message": err.message});
        //sorted the server
    }
   else{
    console.log(req.method + " for " + req.url);
    next();
   }
});


app.use((err,req,res,next)=>{
    console.log(req.method + " for " + req.url);
    next();
});

app.use(bodyParser.urlencoded({extended: true,limit: "50mb"}));
app.use(bodyParser.json({limit: "50mb"}));


/**
 * Routing App to routes/routes.js
 */

routes(app);


/**
 * Creating Server at some available port
 */
let server = app.listen(8082 || process.env.port, () => {
    console.log(`Server is listening at${server.address().address}:${server.address().port}`);
});
process.on('beforeExit',()=>{
    mongoose.disconnect();
});







