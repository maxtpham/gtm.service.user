

var admin = require("firebase-admin");

var serviceAccount = require("../config/supercredit-com-firebase-adminsdk-x3bst-239fe88e6b.json");

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://supercredit-com.firebaseio.com"
});