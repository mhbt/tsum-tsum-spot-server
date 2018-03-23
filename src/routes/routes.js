const userController = require("../controllers/userController");

const routes =  (app)=> {
    /**
     * Registeration request handlers
     */
    app.route("/register")
    .post(userController.registerUser);

    app.route("/login")
    .post(userController.login);
    /**
     * Users request handlers
     */
   app.route("/users")
   .get(userController.getUsers);

   /**
     * Specific user by id:  request handlers
     */
   app.route("/user/:id")
   .get(userController.getUser)
   .put(userController.updateUser)
   .delete(userController.removeUser);
}


module.exports = routes;
// export default routes;
