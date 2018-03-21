"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
class AuthHandler {
    constructor(config, provider, jwtSecret, cookiePaths) {
        this.config = config;
        this.provider = provider;
        this.jwtSecret = jwtSecret;
        this.cookiePaths = cookiePaths;
    }
    tokenHandler(req, res, next) {
        // Persist the jwt cookie to body for App Token
        const cookieValue = jwt.sign(req.user, this.jwtSecret, { expiresIn: Math.round((req.user.expires - Date.now()) / 1000) });
        res.send(cookieValue);
    }
    loggedinHandler(req, res, next) {
        // Persist the jwt cookie to submit along with every application request
        const cookieValue = jwt.sign(req.user, this.jwtSecret, { expiresIn: Math.round((req.user.expires - Date.now()) / 1000) });
        res.header('Set-Cookie', this.cookiePaths.map(path => cookie.serialize('jwt', cookieValue, { path, expires: new Date(req.user.expires) })));
        next();
    }
    /**
     * [OAuth2] Callback Url for Provider to return for notify the completion of the authentication process (with result)
     */
    loginFailureHandler(req, res, next) {
        console.info(`${this.config._log} LOGIN-FAILURE: ${this.provider}`);
        next();
    }
    /**
     * [OAuth2] Logout interface called by user action on UI to terminate current passport session
     */
    logoutHandler(req, res, next) {
        if (!!req.query.callback) {
            req._returnUrl = decodeURIComponent(req.query.callback);
        }
        // Clear the JWT tokens
        res.header('Set-Cookie', this.cookiePaths.map(path => cookie.serialize('jwt', '', { path, expires: new Date(0) })));
        req.logout();
        next();
    }
}
exports.AuthHandler = AuthHandler;
