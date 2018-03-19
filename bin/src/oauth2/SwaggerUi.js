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
const SwaggerUiHandler_1 = require("./SwaggerUiHandler");
const SwaggerUiAuth_1 = require("./SwaggerUiAuth");
function registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, createJwtToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // Swagger UI handlers
        const uiHandler = new SwaggerUiHandler_1.SwaggerUiHandler(config.rootUrl, config.swagger.baseUrl, defaultSwaggerConfigUrl);
        app.get(config.swagger.baseUrl, uiHandler.getRoot.bind(uiHandler));
        app.get(config.swagger.baseUrl + '/index.html', uiHandler.getIndex.bind(uiHandler));
        app.get(config.swagger.baseUrl + '/swagger-ui-bundle.js', uiHandler.getSwaggerUiBundle.bind(uiHandler));
        app.use(config.swagger.baseUrl, uiHandler.getStaticHandler());
        const uiAuth = new SwaggerUiAuth_1.SwaggerUiAuth(config.swagger.baseUrl);
        app.get(config.swagger.baseUrl + '/redirect', uiAuth.redirect.bind(uiAuth));
        Object.keys(config.auth).map((provider) => {
            const uiAuthProvider = new SwaggerUiAuth_1.SwaggerUiAuthProvider(config.swagger.baseUrl, provider, config.auth[provider], config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]), createJwtToken);
            app.get(config.swagger.baseUrl + '/authorization/' + provider, uiAuthProvider.getAuthorization.bind(uiAuthProvider));
            app.post(config.swagger.baseUrl + '/token/' + provider, uiAuthProvider.postToken.bind(uiAuthProvider));
        });
    });
}
exports.registerSwaggerUiInternal = registerSwaggerUiInternal;
