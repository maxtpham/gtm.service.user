"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const GoogleTokenStrategy = require("passport-jwt-google-auth-library");
const OAuth2Transform_1 = require("./OAuth2Transform");
const OAuth2Handler_1 = require("./OAuth2Handler");
function registerAppToken(app, provider, config, createJwtToken, url, requestHandler) {
    switch (provider) {
        case 'google':
            return registerAppTokenGoogle(app, provider, config, createJwtToken, url, requestHandler);
    }
}
exports.registerAppToken = registerAppToken;
function registerAppTokenGoogle(app, provider, config, createJwtToken, url, requestHandler) {
    passport.use(new GoogleTokenStrategy.Strategy(Object.assign({}, config.auth[provider].options, { jwtFromRequest: GoogleTokenStrategy.fromAuthHeader() }), new JwtGoogleAuthLibraryStrategyVerify(provider, createJwtToken).handler));
    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    const authHandler = new OAuth2Handler_1.AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    app.get(url, new PublicAppTokenHandler('jwt-google-auth-library').handler, authHandler.loggedinHandler.bind(authHandler), requestHandler);
}
exports.registerAppTokenGoogle = registerAppTokenGoogle;
class JwtGoogleAuthLibraryStrategyVerify {
    constructor(provider, createJwtToken) {
        this.verifyJwtToken = OAuth2Transform_1.transform0(provider, createJwtToken);
    }
    _handle(request, jwt_payload, done_callback) {
        //this.verifyJwtToken()
        debugger;
    }
    get handler() { return this._handle.bind(this); }
}
class PublicAppTokenHandler {
    constructor(provider) {
        this.defaultPassportHandler = passport.authenticate(provider, {
            session: false
        });
    }
    _handler(req, res, next) {
        if (!!req.query.state) {
            req._returnUrl = decodeURIComponent(req.query.state);
        }
        return this.defaultPassportHandler(req, res, next);
    }
    get handler() {
        return this._handler.bind(this);
    }
}
