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
require("reflect-metadata"); // TypeError: Reflect.hasOwnMetadata is not a function
const lib_common_1 = require("@gtm/lib.common");
const common = require("@gtm/lib.service");
const controllers = require("./controllers/index");
const AppConfig_1 = require("./config/AppConfig");
const AuthService_1 = require("./services/AuthService");
const register_1 = require("./oauth2/register");
function main(test) {
    common.main({
        projectRoot: __dirname,
        moduleConfig: AppConfig_1.default,
        mongoConfig: AppConfig_1.default,
        iocContainer: lib_common_1.iocContainer,
        test,
        created,
        apiRootUrl: '/api/user'
    });
}
exports.main = main;
function created(app, config, iocContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        // Register OAuth2/JWT & Swagger routes
        const authService = iocContainer.get(AuthService_1.AuthServiceTYPE);
        yield register_1.registerOAuth2(app, {
            swaggerBaseDir: __dirname,
            jwtIgnoreUrls: ['/api/user/v1/system/loggedin', '/web/auth/session', '/web/auth/jwt']
        }, config, authService.createJwtToken.bind(authService));
        // Register Web/Controllers
        yield controllers.register(app, config, iocContainer);
    });
}
