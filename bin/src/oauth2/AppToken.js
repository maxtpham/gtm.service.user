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
const passport = require("passport");
const GoogleTokenStrategy = require("passport-jwt-google-auth-library");
const FacebookTokenStrategy = require("passport-facebook-token");
const OAuth2Transform_1 = require("./OAuth2Transform");
const OAuth2Handler_1 = require("./OAuth2Handler");
const SwaggerUiAuth_1 = require("./SwaggerUiAuth");
function registerAppToken(app, provider, config, createJwtToken, url, requestHandler) {
    switch (provider) {
        case 'google':
            return registerAppTokenGoogle(app, provider, config, createJwtToken, url, requestHandler);
        case 'facebook':
            return registerAppTokenFacebook(app, provider, config, createJwtToken, url, requestHandler);
    }
}
exports.registerAppToken = registerAppToken;
function registerAppTokenGoogle(app, provider, config, createJwtToken, url, requestHandler) {
    passport.use(new GoogleTokenStrategy.Strategy({
        clientID: '162769265494-3q8o3gar8pjso775oq7kj3qfd8nreb45.apps.googleusercontent.com',
        secretOrKey: '2NwIOtKbn21wYBq8tGlDKJS1',
        jwtFromRequest: GoogleTokenStrategy.ExtractJwt.fromAuthHeader(),
        passReqToCallback: true
    }, new JwtGoogleAuthLibraryStrategyVerify(provider, createJwtToken).handler));
    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    const authHandler = new OAuth2Handler_1.AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    app.post(url, passport.authenticate('jwt-google-auth-library', { session: false }), !requestHandler ? [authHandler.tokenHandler.bind(authHandler)] : [authHandler.tokenHandler.bind(authHandler), requestHandler]);
}
exports.registerAppTokenGoogle = registerAppTokenGoogle;
function registerAppTokenFacebook(app, provider, config, createJwtToken, url, requestHandler) {
    passport.use(new FacebookTokenStrategy(config.auth[provider].options, OAuth2Transform_1.transform0(provider, createJwtToken)));
    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    const authHandler = new OAuth2Handler_1.AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    app.post(url, passport.authenticate('facebook-token', { session: false }), !requestHandler ? [authHandler.tokenHandler.bind(authHandler)] : [authHandler.tokenHandler.bind(authHandler), requestHandler]);
}
exports.registerAppTokenFacebook = registerAppTokenFacebook;
class JwtGoogleAuthLibraryStrategyVerify {
    constructor(provider, createJwtToken) {
        this.verifyJwtToken = OAuth2Transform_1.transform0(provider, createJwtToken);
    }
    get handler() { return this._handle.bind(this); }
    _handle(request, jwt_payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            // Then create the session with Provider accessToken then generate new jwt as accessToken for client
            // Query for the user info & generate new token for the requested scope
            const profile = yield SwaggerUiAuth_1.SwaggerUiAuthProvider.queryGoogleProfile(request.body.accessToken);
            if (jwt_payload.picture) {
                profile.photos = [{ value: jwt_payload.picture }];
            }
            this.verifyJwtToken(request.body.accessToken, undefined, profile, done);
        });
    }
}
