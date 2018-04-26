const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");
const orderController =  require("../controllers/orderController");

const routes =  (app)=> {

    app.route("/verify")
    .post(authController.verifyToken);
    app.route("/register")
    .post(authController.register);
    app.route("/login")
    .post(authController.login);
   app.route("/users")
   .get(authController.getUsers);
   app.route("/user/:email")
   .get(authController.getUser)
   .put(authController.putUser)
   .delete(authController.deleteUser);


   app.route("/items/")
   .get(itemController.getItems)
   .post(itemController.createItem);
   app.route("/items/active/")
   .get(itemController.getActiveItems);
   app.route("/items/closed/")
   .get(itemController.getClosedItems);
   app.route("/items/purchased/")
   .get(itemController.getPurchasedItems);
   app.route("/items/tobepurchased/")
   .get(itemController.getItemsToBePurchased);

   app.route("/items/:id")
   .get(itemController.getItem)
   .put(itemController.updateItem)
   .delete(itemController.deleteItem);

   app.route("/invoice/")
   .post(orderController.createInvoice)
   .put(orderController.updateInvoice);
   app.route("/invoice/:user_ref")
   .get(orderController.getInvoice);

   app.route("/invoice/order")
   .post(orderController.addOrder)
   .put(orderController.updateOrder);
   app.route("/invoice/order/:user_ref/:order_id")
   .delete(orderController.removeOrder);

}


module.exports = routes;
// export default routes;
