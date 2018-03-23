/**
 * @module - Encrypts, Decrypts and Hashes data.
 * 
 */
const crypto = require("crypto");
class Crypto {
     cipher; // Cipher  Algorithm
     hash;  // Hash Algorithm
     constructor(hash="sha256", cipher="aes256"){
         this.cipher = cipher;
         this.hash = hash;
     }
    /**
     * 
     * @param {string} data --String to be hashed
     * @param {number} rounds --How many rounds to hash it.
     */
    hash(data, rounds){
        let handle = crypto.createHash(this.hash);
        for(let i= 0; i < rounds; i++){
            handle.hash(data);
        }
        return handle.digest("hex");
    }
    encrypt(data, password){
        let handle = crypto.createCipher(this.cipher, password);
        let enc = handle.update(data, 'utf8', 'base64');
        enc += handle.final('base64');
    }
    decrypt(enc, password){
        let handle = crypto.createDecipher(this.cipher, password);
        let dec = handle.update(enc,'base64', 'utf8');
        dec += handle.final('utf8');
    }
 }
module.exports = new Crypto();