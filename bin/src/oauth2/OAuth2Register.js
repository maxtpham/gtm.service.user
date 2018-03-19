"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const OAuth2Handler_1 = require("./OAuth2Handler");
const OAuth2Transform_1 = require("./OAuth2Transform");
let logoutRegistered = false;
/**
 * @param app Auth Express Server
 * @param provider google/facebook
 * @param config hosting service rootUrl (http://localhost:3001), frontend page returnUrl(http://localhost:3000/bin/dev/) & providerConfig
 * @param publicLoginURL /pub/auth/login/google
 * @param publicCallbackURL /pub/auth/callback/google
 * @param publicFailureRedirect /pub/auth/failure/google
 * @param secureLogoutURL /web/auth/logout
 */
function registerOAuth2Internal(app, provider, config, createJwtToken, publicLoginURL, publicCallbackURL, publicFailureRedirect, secureLogoutURL, loggedinHandler, loginFailureHandler, loggedoutHandler) {
    // Register Passport.js OAuth2 Stratergy
    const options = config.auth[provider].options;
    if (!options.callbackURL)
        options.callbackURL = config.rootUrl + publicCallbackURL;
    const npm = config.auth[provider].npm;
    const OAuth2Strategy = require(npm.library)[npm.class]; // Load the Google/Facebook-Stratergy class (from npm package)
    passport.use(new OAuth2Strategy(options, OAuth2Transform_1.default(provider, createJwtToken)));
    // Handle browser request to Login button (this will navigate user to provider login page from the frontend webpage)
    app.get(publicLoginURL, new PublicLoginHandler(provider, config.auth[provider].scope).handler);
    const authHandler = new OAuth2Handler_1.AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    const returnHandler = new RedirectRoute(config.returnUrl).handler;
    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    app.get(publicCallbackURL, new PublicCallbackHandler(provider, config.rootUrl + publicFailureRedirect).handler, authHandler.loggedinHandler.bind(authHandler), loggedinHandler || returnHandler);
    // Handle the failure redirect from Provider
    app.get(publicFailureRedirect, authHandler.loginFailureHandler.bind(authHandler), loginFailureHandler || returnHandler);
    // Handle browser request to Logout button (only available in secured channel/after logged in)
    if (!logoutRegistered) {
        app.get(secureLogoutURL, authHandler.logoutHandler.bind(authHandler), loggedoutHandler || returnHandler);
        logoutRegistered = true;
    }
}
exports.registerOAuth2Internal = registerOAuth2Internal;
class PublicLoginHandler {
    constructor(provider, scope) {
        this.provider = provider;
        this.scope = scope;
        this.defaultPassportHandler = passport.authenticate(provider, { scope: this.scope });
    }
    _handler(req, res, next) {
        return !req.query.callback ? this.defaultPassportHandler(req, res, next) :
            passport.authenticate(this.provider, { scope: this.scope, state: req.query.callback })(req, res, next);
    }
    get handler() {
        return this._handler.bind(this);
    }
}
class PublicCallbackHandler {
    constructor(provider, failureRedirectUrl) {
        this.defaultPassportHandler = passport.authenticate(provider, {
            failureRedirect: failureRedirectUrl,
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
class RedirectRoute {
    constructor(url) { this.url = url; }
    _handler(req, res, next) {
        res.redirect(req._returnUrl || this.url);
    }
    get handler() {
        return this._handler.bind(this);
    }
}
