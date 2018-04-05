const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    item_ref: { // Reference to the item
        type: String,
        required: true,
    },
    quantity: { 
        type: Number,
        type: required,
    },
    description: {
        type: String,
        required: true,
    },
    created_at:{
        type: Number,
    },
    updated_at: {
        type: Number,
    }
});
OrderSchema.index({item_ref: 1});
module.exports = OrderSchema;