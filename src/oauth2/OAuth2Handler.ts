import * as express from 'express';
import * as passport from "passport";
import * as passportJwt from "passport-jwt";
import * as jwt from "jsonwebtoken";
import * as cookie from "cookie";

import { IModuleConfig } from '@gtm/lib.service';
import { JwtToken } from '@gtm/lib.service.auth';

export interface ReturnUrlRequest extends express.Request {
    _returnUrl: string;
}

export class AuthHandler {
    private config: IModuleConfig;
    private provider: string;
    private jwtSecret: string;
    private cookiePaths: string[]; // ['/web', '/api', '/swagger']

    constructor(config: IModuleConfig, provider: string, jwtSecret: string, cookiePaths: string[]) {
        this.config = config;
        this.provider = provider;
        this.jwtSecret = jwtSecret;
        this.cookiePaths = cookiePaths;
    }

    public loggedinHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
        // Persist the jwt cookie to submit along with every application request
        const cookieValue = jwt.sign(req.user, this.jwtSecret, { expiresIn: Math.round(((<JwtToken>req.user).expires - Date.now()) / 1000) });
        res.header('Set-Cookie', <any>this.cookiePaths.map(path => cookie.serialize('jwt', cookieValue, { path, expires: new Date((<JwtToken>req.user).expires) })));
        next();
    }

    /**
     * [OAuth2] Callback Url for Provider to return for notify the completion of the authentication process (with result)
     */
    public loginFailureHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.info(`${this.config._log} LOGIN-FAILURE: ${this.provider}`);
        next();
    }

    /**
     * [OAuth2] Logout interface called by user action on UI to terminate current passport session
     */
    public logoutHandler(req: ReturnUrlRequest, res: express.Response, next: express.NextFunction) {
        if (!!req.query.callback) {
            req._returnUrl = decodeURIComponent(req.query.callback);
        }
        // Clear the JWT tokens
        res.header('Set-Cookie', <any>this.cookiePaths.map(path => cookie.serialize('jwt', '', { path, expires: new Date(0) })));
        req.logout();
        next();
    }
}