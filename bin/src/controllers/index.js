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
const AccountApiController_1 = require("./AccountApiController");
const SystemApiController_1 = require("./SystemApiController");
const SessionApiController_1 = require("./SessionApiController");
const RoleApiController_1 = require("./RoleApiController");
const UserApiController_1 = require("./UserApiController");
const AuthWebController_1 = require("./AuthWebController");
const UserWebController_1 = require("./UserWebController");
function register(app, config, iocContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        // IOC initialize for all web controllers manually (as no reference to them)
        AccountApiController_1.AccountApiController.name;
        SystemApiController_1.SystemApiController.name;
        SessionApiController_1.SessionApiController.name;
        RoleApiController_1.RoleApiController.name;
        UserApiController_1.UserApiController.name;
        AuthWebController_1.AuthWebController.name;
        UserWebController_1.UserWebController.name;
    });
}
exports.register = register;
