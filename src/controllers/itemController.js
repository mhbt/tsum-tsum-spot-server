
const mongoose = require("mongoose");
const itemSchema = require("../modals/itemModal");
const orderSchema = require("../modals/orderModal");
const invoiceSchema = require("../modals/invoiceModal");

const Item = mongoose.model('Item', itemSchema);
const Order = mongoose.model("Order", orderSchema);
const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports.createItem = function createItem (req,res){
    let post = req.body;
    if (!post) res.status(400).send({name: 'Create Item', error: "Item object is required"});
    Item.create(post)
    .then(item=>{
        res.status(201).send({name: 'Create Item', payload: item});
    })
    .catch(error=>{
        res.status(400).send({name: 'Create Item', error: error.message });
    });
};

module.exports.updateItem = function updateItem(req,res){
    let update = req.body;
    let id = req.params.id;
    if (!update || !id) res.status(400).send({name: 'Update Item', error: "Param missing"});
    Item.findById(req.params.id)
    .then(item=>{
        return Item.findByIdAndUpdate(id, update, {new: true});
    })
    .then(item=>{
        res.status(200).send({name: 'Update Item', payload: item});
    })
    .catch(error=>{
         res.status(400).send({name: 'Update Item', error: error.message});
    });
    
}

module.exports.getItem = function getItem(req,res){
    let id = req.params.id;
    if(!id) {
        res.status(400).send({name: 'Get Item', error: 'Missing Param'});
        return;
    }
    Item.findById(id)
    .then(item=>{
        if (item === null) Promise.reject(new Error("Not Found"));
        else res.status(200).send({name: 'Get Item', payload: item});
    })
    .catch(error=>{
        res.status(404).send({name: 'Get Item', error: error.message});
    })


}
module.exports.deleteItem = function deleteItem(req,res){
    let id = req.params.id;
    if(!id) {
        res.status(400).send({name: 'Delete Item', error: 'Missing Param'});
        return;
    }
    Item.findById(id)
    .then(item=>{
        if(!item) Promise.reject('Item not found');
        item.bin = true;
        return Item.findByIdAndUpdate(id, item);
    })
    .then(item=>{
        res.status(200).send({name: 'Delete Item', payload: item});
    })
    .catch(error=>{
        res.status(400).send({name: 'Delete Item', error: error.message});
    });
    
}

module.exports.getItems = function getItems(req,res){
    Item.find({'bin': false, 'status': true})
    .then(items=>{
        res.status(200).send({name:'Get Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Items', error: error.message});
    })
}
module.exports.getActiveItems = function getActiveItems (req,res){
    Item.find({'status': true, 'bin':false})
    .then(items=>{
        res.status(200).send({name:'Get Active Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Active Items', error: error.message});
    })
}
module.exports.getClosedItems = function getClosedItems (req,res){
    Item.find({'status': false, 'bin': false})
    .then(items=>{
        res.status(200).send({name:'Get Closed Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Closed Items', error: error.message});
    })
}

module.exports.getPurchasedItems = function getPurchasedItems(req,res){
    Promise.all([Item.find({}), Invoice.find({})])
    .then((data)=>{
        let items = data[0];
        let invoices = data[1];

    
      let purchased = items.filter(function (item, index) {
        let order_count = 0;
        let invoice = 
        invoices.forEach(invoice=>{
            item.orders.forEach(order=>{
                order_count += invoice.orders.id(order).quantity;
            });
          });
    
        item.set('unused',item.availablity === 'in-stock' ? order_count <= item.stock ? item.stock - order_count : null : order_count, { strict: false });
        //   item.to_buy = item.availablity === 'in-stock' ? order_count > item.stock ? order_count - item.stock : null : order_count; 
          return item.availablity === 'in-stock' ? order_count <= item.stock ? true : false : order_count === 0 ? true : false; 
          console.log(order_count);
        });
        res.send({name: "Get Purchased Items", payload: purchased});
    })
    .catch(error=>{
        console.log(error);
    });
}
module.exports.getItemsToBePurchased = function getItemsToBePurchased(req,res){
    Promise.all([Item.find({}), Invoice.find({})])
    .then((data)=>{
        let items = data[0];
        let invoices = data[1];

    
      let purchased = items.filter(function (item, index) {
        let order_count = 0;
        let invoice = 
        invoices.forEach(invoice=>{
            item.orders.forEach(order=>{
                order_count += invoice.orders.id(order).quantity;
            });
          });
    
        item.set('to_buy',item.availablity === 'in-stock' ? order_count > item.stock ? order_count - item.stock : null: order_count, { strict: false });
        //   item.to_buy = item.availablity === 'in-stock' ? order_count > item.stock ? order_count - item.stock : null : order_count; 
          return item.availablity === 'in-stock' ? order_count > item.stock ? true : false : true; 
          console.log(order_count);
        });
        res.send({name: "Get Purchased Items", payload: purchased});
    })
    .catch(error=>{
        console.log(error);
    });
}