/**
 * @module - Encrypts, Decrypts and Hashes data.
 * 
 */
const crypto = require("crypto");
class Crypto {
     constructor(hash="sha256", cipher="aes256"){
         this._cipher = cipher;
         this._hash = hash;
     }
    /**
     * 
     * @param {string} data --String to be hashed
     * @param {number} rounds --How many rounds to hash it.
     */
    hash(data, rounds = 2){
        let handle = crypto.createHash(this._hash);
        for(let i= 0; i < rounds; i++){
            handle.update(data);
        }
        return handle.digest("hex");
    }
    encrypt(data, password){
        let handle = crypto.createCipher(this._cipher, password);
        let enc = handle.update(data, 'utf8', 'base64');
        enc += handle.final('base64');
        return enc;
    }
    decrypt(enc, password){
        let handle = crypto.createDecipher(this._cipher, password);
        let dec = handle.update(enc,'base64', 'utf8');
        dec += handle.final('utf8');
        return dec;
    }
    unsign(enc, password){
        try{
            return this.decrypt(enc, this.hash(password,1));
        }catch(error){
            return false;
        }
    }
    sign(data){
        return this.encrypt(this.hash(data,2), this.hash(data,1));
    }
    getHash(data){
        return this.hash(data, 2);
    }
 }
module.exports = new Crypto();