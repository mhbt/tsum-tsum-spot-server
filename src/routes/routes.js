const authController = require("../controllers/authController");
const itemController = require("../controllers/itemController");

const routes =  (app)=> {

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


   app.route("/items")
   .get(itemController.getItems)
   .post(itemController.createItem);
   app.route("/items/active")
   .get(itemController.getActiveItems);
   app.route("/items/closed")
   .get(itemController.getClosedItems);
   app.route("items/purchased")
   .get(itemController.getPurchasedItems);
   app.route("/items/:id")
   .get(itemController.getItem)
   .put(itemController.updateItem)
   .delete(itemController.deleteItem);

}


module.exports = routes;
// export default routes;
