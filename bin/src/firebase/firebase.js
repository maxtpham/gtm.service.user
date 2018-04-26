"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
const supercredit_com_firebase_adminsdk_x3bst_239fe88e6b_json_1 = require("../config/supercredit-com-firebase-adminsdk-x3bst-239fe88e6b.json");
exports.firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(supercredit_com_firebase_adminsdk_x3bst_239fe88e6b_json_1.default),
    databaseURL: "https://supercredit-com.firebaseio.com"
});
