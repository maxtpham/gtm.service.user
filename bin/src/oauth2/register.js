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
const config_1 = require("./config");
const auth = require("@gtm/lib.service.auth");
const SwaggerUi_1 = require("./SwaggerUi");
const OAuth2Register_1 = require("./OAuth2Register");
/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 */
function registerOAuth2(app, authParams, config, params) {
    return __awaiter(this, void 0, void 0, function* () {
        // Normalize the config
        config = config_1.normalizeOAuth2(config);
        // Call to registration of standard Auth
        const defaultSwaggerConfigUrl = yield auth.registerAuth(app, config, authParams, true);
        // Register Swagger-UI 
        yield SwaggerUi_1.registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, params.createJwtToken);
        // Finally register JWT/OAuth2 with all supported passport.js Providers (Google, Facebook)
        Object.keys(config.auth).map((provider) => OAuth2Register_1.registerOAuth2Internal(app, provider, config, params.createJwtToken, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/login/${provider}`, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/callback/${provider}`, `${(params.oauth2 || {}).baseUrl || '/pub/auth'}/failure/${provider}`, (params.oauth2 || {}).logoutUrl || '/web/auth/logout'));
    });
}
exports.registerOAuth2 = registerOAuth2;
