const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const addressSchema = new Schema({
    line1:{
        type: String,
    },
    line2:{
        type: String,
    },
    city:{
        type: String,
    }, 
    zip:{
        type: Number,
    },
    country:{
        type: String,
    }
});
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin:{
        type: Boolean,
        default: false
    },
    address : {
        type: addressSchema,
        required: true,
    },
    phone: {
        type: String,
        required:true
    },
    created_at: {
        type: Date,
        default : Date.now()
    }
});

module.exports = userSchema;