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
const AuthWebController_1 = require("./AuthWebController");
function register(app, config, iocContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        // IOC initialize for all web controllers manually (as no reference to them)
        AuthWebController_1.AuthWebController.name;
    });
}
exports.register = register;
