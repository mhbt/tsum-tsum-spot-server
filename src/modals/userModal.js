const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const addressSchema = new Schema({
    line1:{
        type: String,
        required: true,
    },
    line2:{
        type: String,
    },
    city:{
        type: String,
        required: true,
    }, 
    state:{
        type: String,
    },
    zip:{
        type: Number,
    },
    country:{
        type: String,
        required: true,
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
    _id:{
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
    created_at:{
        type: Number,
    },
    updated_at: {
        type: Number,
    },
    paypal:{
        type: String,
    },
    venmo: {
        type: String
    }
});

module.exports = userSchema;