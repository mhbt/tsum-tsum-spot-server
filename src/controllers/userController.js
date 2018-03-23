const conf = require("../conf/conf");
const mongoose = require("mongoose");
const userSchema = require("../modals/userModal");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User", userSchema);

module.exports.registerUser = function registerUser(req,res,next) {
    let user = req.body;
    // bcrypt.hash(user.password, saltRounds)
    // .then(hash =>{
    //     req.body.password = hash;
    //     let newUser = new User(req.body);
    //     newUser.save((err, user)=>{
    //     if(err) res.send(err);
    //     else res.json(user);
    //     });
    // })
    // .catch(err =>{
    //     res.status(400).send({"message": "Something is wrong with submittion"});
    // });
    
}
module.exports.getUsers = function getUsers (req,res, next){
    User.find({}, (err, users)=>{
        if(err) res.send(err);
        else {
            res.status(200).json(users);
          }
    });
}

module.exports.getUser = function getUser(req,res){
    
    User.findById(req.params.id, (err, user)=>{
        if (err) res.send(err);
        else res.json(user);
    });
}

module.exports.updateUser = function updateUser(req,res){
    User.findOneAndUpdate({_id: req.params.id},req.body, {new: true} ,(err, user)=>{
        if (err) res.send(err);
        else res.json(user);
    });
}
module.exports.removeUser = function removeUser(req,res){
    User.remove({lastName: req.params.id},(err, user) => {
        if (err) res.send(err);
        else res.json(user);
      })
}

module.exports.login = function login (req,res){
    User.findOne({"email": req.body.email},(err, user)=>{
        if(err) res.status(401).send({message: err.message});
        else{
            bcrypt.compare(req.body.password, user.password,(err,result)=>{
                if (err) res.status(401).send({message: err.messasge});
                else{
                    let payload = {
                        email : user.email,
                        id : user._id,
                        admin: user.admin
                    }
                    jwt.sign(payload,conf["jwt-secret"],{expiresIn: "365d"}, (err,_token) =>{
                       if(!err){
                        res.status(200).send({
                            user: {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                            },
                            token: _token, 

                        });
                       }
                       else {
                           res.status(500).send({message: err.message});
                       }
                    });
                    
                }
            });
        }
    });
}

function decode_token(req){
    let authorizationHeader = req.headers.authorization.split(" ");
    let token = authorizationHeader[1];
    jwt.verify(token, conf["jwt-secret"], (err, decoded)=> {
        if(err) return err.message;
        else return decoded;
    });
}