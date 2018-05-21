const admin = require("firebase-admin");
const conf = require("../conf/conf");
const serviceAccount = require("../conf/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tsum-tsum-spot.firebaseio.com"
  });
module.exports = admin;