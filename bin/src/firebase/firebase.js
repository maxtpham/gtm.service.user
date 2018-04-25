"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var serviceAccount = require("../config/supercredit-com-firebase-adminsdk-x3bst-239fe88e6b.json");
exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://supercredit-com.firebaseio.com"
});
