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
const UserRepositoryTest_1 = require("./UserRepositoryTest");
function testRepositories(app, iocContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        iocContainer.bind(UserRepositoryTest_1.UserRepositoryTest).toSelf();
        yield iocContainer.resolve(UserRepositoryTest_1.UserRepositoryTest).run();
        return Promise.resolve();
    });
}
exports.testRepositories = testRepositories;
