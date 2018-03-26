import { isNull, isUndefined, isNullOrUndefined } from "util";

const mongoose = require("mongoose");
const itemSchema = require("../modals/itemModal");

const Item = mongoose.model('Item', itemSchema);
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

        for(let prop in item){
            item.prop = 0;
            // item.prop = !isNullOrUndefined(update.prop) ? update.prop : item.prop;
        }
        console.log(item);
        return Item.findByIdAndUpdate(id, item, {new: true});
    })
    .then(item=>{
        console.log(item);
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
    Item.find({})
    .then(items=>{
        res.status(200).send({name:'Get Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Items', error: error.message});
    })
}
module.exports.getActiveItems = function getActiveItems (req,res){
    Item.find({'status': true})
    .then(items=>{
        res.status(200).send({name:'Get Active Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Active Items', error: error.message});
    })
}
module.exports.getClosedItems = function getClosedItems (req,res){
    Item.find({'status': false})
    .then(items=>{
        res.status(200).send({name:'Get Closed Items', payload: items});
    })
    .catch(error=>{
        res.status(404).send({name:'Get Closed Items', error: error.message});
    })
}

module.exports.getPurchasedItems = function getPurchasedItems(req,res){
    Item.find({
        'stock': {
            $gte:{
                'orders': {
                    $size
                }
            }
        }
    })
}