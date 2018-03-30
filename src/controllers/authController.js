import { Error } from "mongoose";
const util = require("util");
const conf = require("../conf/conf");
const mongoose = require("mongoose");
const userSchema = require("../modals/userModal");
const auth = require('../modules/auth/auth');
const jwt = require('jsonwebtoken');

const User = mongoose.model("User", userSchema);


module.exports.register = function register(req,res) {
    let user = req.body;
    User.findOne({'_id': user._id})
    .then(data=>{
        if(data === null) return Promise.resolve(user);
        return Promise.reject(new Error('Pardon Us! Someone registered this email, if that was you, you can login or request a new password'));
    })
    .then(user=>{
        user.password = auth.hash(user.password);
        return User.create(user);
    })
    .then(response=>{
        return Promise.resolve({name: 'Registration', payload: 'Succefully Registered User'});
    })
    .then(response=>{
        res.status(200).json(response);
    })
    .catch(err=>{
        console.error({name: "Authentication", error: err.message});
        res.send({name: "Authentication", error: err.message});
    })
}
module.exports.login = function login(req,res){
    let credentials = req.body;
    if(!credentials._id || !credentials.password){
        res.status(404).send({name: 'Login', error: "Error: Email or Password is missing..."});
    }else{
        User.findById(credentials._id)
        .then(user=>{
            if (util.isNullOrUndefined(user)) return Promise.reject(new Error("Error: Our best bet is that email miss-matched with password!"));
            let success = auth.compare(credentials.password,user.password);
            if(success) return Promise.resolve(user);
            return Promise.reject(new Error("Error: Our best bet is that email miss-matched with password!"));
        })
        .then(user=>{
            let payload = {
                'email': user._id,
                'role': user.admin ? 'admin' : 'customer',
            }
            jwt.sign(payload, conf.jwt_secret, {expiresIn: '365d'}, (err, token)=>{
                if(!err) res.send({
                    name:"Login", 
                    payload: {
                        token: token,
                        user: sanitizeUser(user)
                    }
                });
            });
        })
        .catch(error=>{
            console.error(error.message);
            res.status(200).send({name: 'Login', error: error.message});
        });
    }
}
module.exports.putUser = function putUser(req,res){
    let email = req.params.email;
    let update = req.body;
    if(!update || !email){
        res.status(400).send({name:"Update User", payload: "Missing Param/s!"});
        return;
    }
    User.findById(email)
    .then(user=>{
        if (update.password || update._id) return Promise.reject(new Error('Email & Password cannot be set with this method'));
        for (let  prop in user ){
            user[prop] = update[prop] ? update[prop] : user[prop]; 
        }
        return Promise.resolve(user);
    })
    .then(user=>{
        return User.findByIdAndUpdate(email,user,{new: true});
    })
    .then(user=>{
        res.status(200).send({name:"Update User", payload:sanitizeUser(user)});
    })
    .catch(error=>{
        console.log(error.message);
        res.status(304).send({name:"Update User", error: error.message});
    })
}
module.exports.getUsers = function getUsers (req,res, next){
    User.find({}, (err, users)=>{
        if(err) res.send(Error(err.message));
        else {
            res.status(200).json(users);
          }
    });
}
module.exports.getUser = function getUser(req,res){
    
    User.findById(req.params.email, (error, user)=>{
        if (error) res.send({name:"Get User", error: error.message});
        else res.status(302).json(sanitizeUser(user));
    });
}
module.exports.deleteUser = function deleteUser(req,res){
    // res.send(req.header("Authorization"));
    let token =req.header("Authorization").split(" ")[1];
    let decoded = auth.decodeToken(token);
    if(decoded.payload.role !== 'admin') return;
    console.log(decoded);
    User.findById(req.params._id,(err, user) => {
        if (err) res.send({name:"Delete User", error: error.message});
        else if (!user)  res.send({name:"Delete User",payload:'Delete request Failed!'});
        if(user._id !== decoded.payload._id){
            User.findByIdAndRemove(user._id,(err, user)=>{
                if(err) res.send({name:"Delete User", error: error.message});
               else res.send({name:"Delete User",payload:'Delete request Successful!'});
            });
        } else{
            res.send({name:"Delete User",payload:'Delete request Failed!'});
        }
      })
}


function sanitizeUser(user){
    let temp = {
        _id: user._id,
        firstName : user.firstName,
        lastName : user.lastName,
        address: user.address,
        phone: user.phone,
        paypal: user.paypal,
        venmo: user.venmo
    }
    temp.address._id = undefined;
    return temp;
}
