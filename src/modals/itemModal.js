const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    image: {
        type: String,
    }, 
    price: {
        type: Number,
    },
    orders: {
        type: Array,
        default: []
    },
    /**
     * @prop status
     * @type Boolean 
     * @true : Accepting/Active,
     * @false: closed
     */
    status:{
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
    },
    created_at:{
        type: Number,
    },
    updated_at:{
        type:Number,
    },
    /**
     * @prop bin
     * @type boolean
     * @tells if item is archived,
     */
    bin: {
        type: Boolean,
        default: false,
    },
    /**
     * @prop availibilty
     * @type String
     * @val: in-stock,
     * @val: on-order
     */
    availablity: {
        type: String,
        default: 'on-order'

    },
    /**
     * @prop stock
     * @val - Inventory stock value if availability ==='in-stock',
     */
    stock :{
        type: Number,
        default: null,
    },
    leased: {
        type: Number,
        default: null,
    }
});
ItemSchema.index({bin: 1, status: 1});
module.exports = ItemSchema;