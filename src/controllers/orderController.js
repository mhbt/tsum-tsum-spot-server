const mongoose = require("mongoose");
const orderSchema = require("../modals/orderModal");
const invoiceSchema = require("../modals/invoiceModal");
const itemSchema = require("../modals/itemModal");
const Item = mongoose.model("Item", itemSchema);
const Order = mongoose.model("Order", orderSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);


module.exports.getInvoice = function getInvoice(req,res){
    let user_ref= req.params.user_ref;
    console.log(user_ref);
    Invoice.findOne({'user_ref': user_ref, 'bin': false})
    .then(invoice=>{
        res.send({name: 'Get invoice', payload: invoice});
    })
    .catch(error=>{
        res.send({name: 'Get invoice', error: error.message});
    })
}
module.exports.createInvoice = function createInvoice(req, res) {
    if (req.body.user_ref) {
        Invoice.find({ 'user_ref': req.body.user_ref, "bin": false })
            .then(data => {
                if (data.length === 0) {
                    let item_ref = req.body.item_ref ? req.body.item_ref : null;
                    let quantity = req.body.quantity ? req.body.quantity : null;
                    let description = req.body.description ? req.body.description : null;
                    let status = req.body.status ? req.body.status : false;
                    let date = new Date();
                    let stamp = req.body.time ? req.body.time : date.getTime();
                    let order = {
                        item_ref: item_ref,
                        quantity: quantity,
                        description: description,
                        status: status,
                        created_at: stamp,
                        updated_at: stamp
                    };
                    console.log(order);
                    let invoice = {
                        user_ref: req.body.user_ref,
                        orders: [order],
                        created_at: stamp,
                        updated_at: stamp,

                    };
                    return Promise.resolve(invoice);
                }else{
                    return Promise.reject(new Error("Invoice already exsists"));
                }
            })
            .then((invoice)=>{
                return Invoice.create(invoice);
            })
            .then((invoice)=>{
                return Promise.all([Promise.resolve(invoice),Item.findByIdAndUpdate(invoice.orders[0].item_ref, {"$push": {"orders": invoice.orders[0]._id}})]);
            })
            .then(data =>{
                res.send({name:'Create Invoice', payload: data[0]});
            })
            .catch(error => {
                res.send({name: 'Create Invoice', error: error.message});
                console.log(error.message);
            });
    } else {
        res.send({name: 'Create Invoice', error: 'Reference to User not found'});
        console.log('Reference to user not found');
    }
}
module.exports.updateInvoice = function updateInvoice(req,res){
    if (req.body.user_ref) {
        let date = new Date;
        req.body.updated_at = req.body.updated_at ? req.body.updated_at : date.getTime();
        let user_ref = req.body.user_ref;
        delete req.body.user_ref;
        Invoice.findOneAndUpdate({ 'user_ref': user_ref, "bin": false },req.body,{new: true})
            .then(invoice=>{
                res.send({name:'Update Invoice', payload: invoice});
            })
            .catch(error => {
                res.send({name: 'Update Invoice', error: error.message});
                console.log(error.message);
            });
    } else {
        res.send({name: 'Update Invoice', error: 'Reference to User not found'});
        console.log('Reference to user not found');
    }
    
}
module.exports.addOrder = function addOrder(req,res){
    if(req.body.user_ref){
        let stamp = new Date().getTime();
        req.body.order.created_at = req.body.order.created_at  || stamp;
        req.body.order.updated_at = req.body.order.updated_at  || stamp;
        Invoice.findOneAndUpdate({'user_ref': req.body.user_ref, 'bin': false}, {"$push": {"orders": req.body.order}}, {new: true})
        .then(invoice=>{
            let orderId = invoice.orders[invoice.orders.length - 1]._id;
            let item_ref = invoice.orders[invoice.orders.length - 1].item_ref;
            console.log(orderId,item_ref);
            return Promise.all([Promise.resolve(invoice), Item.findByIdAndUpdate(item_ref,{"$push":{"orders": orderId}},{new: true})]);
        })
        .then(data=>{
            // console.log(data[0], data[1]);
            res.send({name: 'Add Order', payload: data[0]});
        })
        .catch(error=>{
            res.send({name: 'Add Order', error: error.message});
            console.log(error);
        });
    }else{
        console.log({name: "Add Order", error: "User reference not found"});
        res.send({name: "Add Order", error: "User reference not found"});
    }
}
module.exports.updateOrder = function updateOrder(req,res){
    if( req.body.user_ref && req.body.order_id && req.body.order ){
        let stamp = new Date().getTime();
        req.body.order.updated_at = req.body.upated_at || stamp;
    Invoice.findOne({"user_ref": req.body.user_ref, "bin": false})
    .then(invoice=>{
        let id = invoice._id;
        let order = invoice.orders.id(req.body.order_id); 
        let update = req.body.order;
        for(prop in update){ //accessed by
            if(prop === 'created_at' || prop === '_id') continue;
            // console.log(req.body.order[prop]);
            order[prop] = req.body.order[prop];
        }
        invoice.save();
       return Promise.resolve({name: "Update Order", payload: invoice});
    })
    .then(invoice=>{
        res.send(invoice);
    })
    .catch(error=>{
        res.send({name: "Update Order", error: error.message});
    });
    }else{
        console.log({name: "Update Order", error: "User reference or Order Id not found"});
        res.send({name: "Update Order", error: "User reference or Order Id not found"});
    }
}
module.exports.removeOrder = function removeOrder(req,res){
    if( req.params.user_ref && req.params.order_id){
    Invoice.findOne({"user_ref": req.params.user_ref, "bin": false})
    .then(invoice=>{
        let item_ref = invoice.orders.id(req.params.order_id).item_ref;
        invoice.orders.id(req.params.order_id).remove();
        invoice.save();
       return Promise.all([Promise.resolve(invoice), Item.findByIdAndUpdate(item_ref,{"$pull": {"orders": mongoose.Types.ObjectId(req.params.order_id)}},{new: true})]);
    })
    .then(data=>{
       res.send({name: "Remove Order", payload: data[0]});
        console.log(data[1]);

    })
    .catch(error=>{
        res.send({name: "Remove Order", error: error.message});
    });
    }else{
        console.log({name: "Remove Order", error: "User reference or Order Id not found"});
        res.send({name: "Remove Order", error: "User reference or Order Id not found"});
    }
}
module.exports.getAllInvoices= function getAllInvoices(req,res){
    let stage = +req.params.stage;
    // console.log(stage);
    if(!stage) {res.send({name:"Get All Invoices", error: "Param Missing"})}

    Invoice.find({bin: false, stage: stage})
    .then(invoices=>{
        // console.log(invoices);
        res.send({name: 'Get All Invoices', payload: invoices});
    })
    .catch(error=>{
        console.log(error.message);
        res.send({name: 'Get All Invoices', error: error.message});
    });
}