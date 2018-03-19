import * as express from 'express';
import * as passport from "passport";

import { AuthHandler, ReturnUrlRequest } from "./OAuth2Handler";
import { urlencoded } from 'body-parser';

import OAuth2Transform from "./OAuth2Transform";
import { IOAuth2Config } from './config';
import { CreateJwtTokenFunction } from './types';

let logoutRegistered: boolean = false;

/**
 * @param app Auth Express Server
 * @param provider google/facebook
 * @param config hosting service rootUrl (http://localhost:3001), frontend page returnUrl(http://localhost:3000/bin/dev/) & providerConfig
 * @param publicLoginURL /pub/auth/login/google
 * @param publicCallbackURL /pub/auth/callback/google
 * @param publicFailureRedirect /pub/auth/failure/google
 * @param secureLogoutURL /web/auth/logout
 */
export function registerOAuth2Internal(
    app: express.Application, provider: string, config: IOAuth2Config, createJwtToken: CreateJwtTokenFunction,
    publicLoginURL: string, publicCallbackURL: string, publicFailureRedirect: string, publicAppTokenURL: string, secureLogoutURL: string,
    loggedinHandler?: express.RequestHandler, loginFailureHandler?: express.RequestHandler, loggedoutHandler?: express.RequestHandler
) {
    // Register Passport.js OAuth2 Stratergy
    const options = config.auth[provider].options;
    if (!options.callbackURL) // Build callback Url
        options.callbackURL = config.rootUrl + publicCallbackURL;
    const npm = config.auth[provider].npm;
    const OAuth2Strategy = require(npm.library)[npm.class]; // Load the Google/Facebook-Stratergy class (from npm package)
    passport.use(new OAuth2Strategy(options, OAuth2Transform(provider, createJwtToken)));

    // Handle browser request to Login button (this will navigate user to provider login page from the frontend webpage)
    app.get(publicLoginURL, new PublicLoginHandler(provider, config.auth[provider].scope).handler);

    const authHandler = new AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));

    const returnHandler: express.Handler = new RedirectRoute(config.returnUrl).handler;

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

class PublicLoginHandler {
    private provider: string;
    private scope: string | string[];
    private defaultPassportHandler: express.Handler;

    constructor(provider: string, scope: string | string[]) {
        this.provider = provider;
        this.scope = scope;
        this.defaultPassportHandler = passport.authenticate(provider, <passport.AuthenticateOptions>{ scope: this.scope });
    }

    private _handler(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return !req.query.callback ? this.defaultPassportHandler(req, res, next) :
            passport.authenticate(this.provider, <passport.AuthenticateOptions>{ scope: this.scope, state: req.query.callback})(req, res, next);
    }

    public get handler(): express.Handler {
        return this._handler.bind(this);
    }
}

class PublicCallbackHandler {
    private defaultPassportHandler: express.Handler;
    constructor(provider: string, failureRedirectUrl: string) {
        this.defaultPassportHandler = passport.authenticate(provider, <passport.AuthenticateOptions>{
            failureRedirect: failureRedirectUrl, // DO NOT USE: successRedirect: config.rootUrl + `/web/auth/callback/success/${provider}`,
            session: false
        });
    }

    private _handler(req: ReturnUrlRequest, res: express.Response, next: express.NextFunction): any {
        if (!!req.query.state) {
            req._returnUrl = decodeURIComponent(req.query.state);
        }
        return this.defaultPassportHandler(req, res, next);
    }

    public get handler(): express.Handler {
        return this._handler.bind(this);
    }
}

class PublicAppTokenHandler {
    private defaultPassportHandler: express.Handler;
    constructor(provider: string, failureRedirectUrl: string) {
        this.defaultPassportHandler = passport.authenticate(provider, <passport.AuthenticateOptions>{
            failureRedirect: failureRedirectUrl, // DO NOT USE: successRedirect: config.rootUrl + `/web/auth/callback/success/${provider}`,
            session: false
        });
    }

    private _handler(req: ReturnUrlRequest, res: express.Response, next: express.NextFunction): any {
        if (!!req.query.state) {
            req._returnUrl = decodeURIComponent(req.query.state);
        }
        return this.defaultPassportHandler(req, res, next);
    }

    public get handler(): express.Handler {
        return this._handler.bind(this);
    }
}


class RedirectRoute {
    private url: string;
    constructor(url: string) { this.url = url; }

    private _handler(req: ReturnUrlRequest, res: express.Response, next: express.NextFunction): any {
        res.redirect(req._returnUrl || this.url);
    }

    public get handler(): express.Handler {
        return this._handler.bind(this);
    }
}