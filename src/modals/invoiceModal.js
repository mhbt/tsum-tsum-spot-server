const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InvoiceShema = new Schema({
    user_ref: { //Reference to the user
        type: String,
        required: true,
    },
    orders: {
        type: Array,
    },
    /**
     * @prop status 
     * @description stage1--pending | stage2--ready | stage3--paid | stage4--shipped | stage5--completed
     */
    stage: {
        type: Number,
        default: 1,
    },
    /**
     * @prop receiving
     * @description method1--shipment(true) method2--pickup(false)
     * @default shipment
     */
    receiving: {
        type: Boolean,
        default: true,
    },
    payable: {
        order: {
            type: Number,
            default: null,
        },
        shipment: {
            type: Number,
            default: null,
        }
    },
    bin :{
        type: Boolean,
        default: false,
    }
});
InvoiceShema.index({user_ref: 1});