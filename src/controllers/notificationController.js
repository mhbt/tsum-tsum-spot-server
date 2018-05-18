const util = require("util");
const conf = require("../conf/conf");
const mongoose = require("mongoose");
const userSchema = require("../modals/userModal");
const auth = require('../modules/auth/auth');
const jwt = require('jsonwebtoken');

const User = mongoose.model("User", userSchema);

module.exports.refresh_device_token = function(req, res){
    let token = req.body.token;
    let email = req.body.email;
    User.findOneAndUpdate({'_id': email}, {'device_token': token}, {new: true})
    .then(user=>{
        res.send({name: "Refresh Device Token", payload:sanitizeUser(user)});
    })
    .catch(err=>{
        res.send({name: "Refresh Device Token", error: err.message});
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
        venmo: user.venmo,
        device_token: user.device_token
    }
    temp.address._id = undefined;
    return temp;
}