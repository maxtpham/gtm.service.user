"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("./firebase");
class FireBaseNotifi {
    static sendForTopPic(topic, title, message, fcm, screenID) {
        return __awaiter(this, void 0, void 0, function* () {
            var payload = {
                notification: {
                    title: title,
                    body: message,
                },
                data: {
                    screenID: screenID,
                }
            };
            firebase_1.firebaseAdmin.messaging().send(topic, payload).then((response) => {
                // console.log(response);
                return Promise.resolve("Gửi tin thành công");
            }).catch((error) => {
                console.log(error);
                return Promise.reject("Lỗi: " + error);
            });
            return Promise.reject("Không gửi được tin");
        });
    }
    static sendForScreen(title, message, fcm, screenID) {
        return __awaiter(this, void 0, void 0, function* () {
            var payload = {
                notification: {
                    title: title,
                    body: message,
                },
                data: {
                    screenID: screenID,
                },
                token: fcm
            };
            firebase_1.firebaseAdmin.messaging().send(payload).then((response) => {
                // console.log(response);
                return Promise.resolve("Gửi tin thành công");
            }).catch((error) => {
                return Promise.reject("Lỗi: " + error);
            });
            return Promise.reject("Không gửi được tin");
        });
    }
    static sendForMessage(title, message, fcm, userId, screenID) {
        return __awaiter(this, void 0, void 0, function* () {
            var payload = {
                notification: {
                    title: title,
                    body: message,
                },
                data: {
                    title: title,
                    message: message,
                    screenID: screenID,
                    userId: userId,
                },
                token: fcm
            };
            firebase_1.firebaseAdmin.messaging().send(payload).then((response) => {
                return Promise.resolve("Gửi tin thành công");
            }).catch((error) => {
                return Promise.reject("Lỗi: " + error);
            });
            return Promise.reject("Không gửi được tin");
        });
    }
}
exports.default = FireBaseNotifi;
