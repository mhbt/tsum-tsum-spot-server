/** 
 * @module - Authenticate and Register users
 * 
*/
const crypto = require("./crypto");
var jwt = require('jsonwebtoken');
 class Auth {
    compare(post,saved){
        let hash = crypto.getHash(post);
        let dec = null;
        try{
             dec = crypto.unsign(saved, post);
        }catch(error){
            return false;
        }
       if ( hash === dec) return true;
       else return false;
    }
    hash(password){
        return crypto.sign(password);
    }
    decodeToken(token){
       return jwt.decode(token,{complete: true, json: true});
    }
 }
 module.exports = new Auth();