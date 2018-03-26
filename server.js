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
    debug.log(err);
});

/**
 * Middlewares
 */
app.use((err,req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.method + " for " + req.url);
    next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(check_jwt({secret: conf.jwt_secret}).unless({ path: ["/register", "/login"]}));
/**
 * Error handling middleware
 */
app.use((err,req,res,next)=>{
    if(err){
        res.status(401).send({"message": err.message});
    }
    console.log(req.method + " for " + req.url);
    next();
});


/**
 * Routing App to routes/routes.js
 */

routes(app);


/**
 * Creating Server at some available port
 */
let server = app.listen(8082 || process.env.port, () => {
    debug.log(`Server is listening at http://localhost:${server.address().port}`);
});
process.on('beforeExit',()=>{
    mongoose.disconnect();
});







