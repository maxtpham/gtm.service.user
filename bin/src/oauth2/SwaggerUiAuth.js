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
const requestPromise = require("request-promise-native");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const OAuth2Transform_1 = require("./OAuth2Transform");
class SwaggerUiAuth {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    /**
     * [GET /swagger/redirect?code=arg1&state=arg2] Redirect from SwaggerUI to dynamic generated Url to swagger-dist-ui oauth2-redirect.html
     */
    redirect(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.redirect(this.baseUrl + `/oauth2-redirect.html?state=${req.query.state}&code=${req.query.code}`);
        });
    }
}
exports.SwaggerUiAuth = SwaggerUiAuth;
class SwaggerUiAuthProvider {
    constructor(basePath, provider, swaggerAuthConfig, jwtSecret, jwtPaths, createJwtToken) {
        this.basePath = basePath;
        this.provider = provider;
        this.config = swaggerAuthConfig;
        this.jwtSecret = jwtSecret;
        this.jwtPaths = jwtPaths;
        this.verifyJwtToken = OAuth2Transform_1.default(provider, createJwtToken);
    }
    /**
     * [GET /swagger/authorization/:provider?response_type=&client_id=&redirect_uri=&scope=&state] OAuth2 authorization proxy
     * to convert from selected scope to default Provider's auth code then encode the requested scopes in the cookies to process later
     */
    getAuthorization(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Save the requested scopes for later token exchange (HttpOnly - same browser session in 15 minutes, while waiting for user input for loggin)
            res.cookie('scope', (req.query.scope && (req.query.scope.length > 0)) ? req.query.scope : 'read', { httpOnly: true, path: `${this.basePath}/token/${this.provider}`, maxAge: 900000 });
            // Check loggedin?
            if (req.user.session) {
                // Do not need to follow provider OAuth2 login process, redirect to local OAuth2 proxy
                res.redirect(`${req.query.redirect_uri}?${querystring.stringify({
                    state: req.query.state,
                    code: 'jwt'
                })}`);
            }
            else {
                // Redirect user to the original Provider authorization Url with configured: client_id & scopes
                res.redirect(`${this.config.authorizationUrl}?${querystring.stringify({
                    response_type: req.query.response_type,
                    client_id: this.config.options.clientID,
                    redirect_uri: req.query.redirect_uri,
                    scope: this.config.scope.join(' '),
                    state: req.query.state,
                })}`);
            }
        });
    }
    /**
     * [POST /swagger/token/:provider?grant_type=&code=&client_id=&client_secret=&redirect_uri] OAuth2 token exchange proxy: to exchange token code with Provider then convert to local token for SwaggerUI client
     */
    postToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            // Clear the requested scopes
            res.cookie('scope', '', { httpOnly: true, path: `${this.basePath}/token/${this.provider}`, expires: new Date(0) });
            // Check loggedin?
            if (req.user.session) {
                // Send the request directly (server-side) to Original Provider to exchange the token
                token = {
                    access_token: req.cookies.jwt,
                    token_type: 'Bearer',
                    expires_in: Math.round((Date.parse(req.user.expires) - new Date().getTime()) / 1000)
                };
                // Return the token
                res.send(token);
            }
            else {
                let profile;
                try {
                    // Send the request directly (server-side) to Original Provider to exchange the token
                    token = JSON.parse(yield requestPromise(this.config.tokenUrl, {
                        method: 'POST',
                        form: {
                            grant_type: req.body.grant_type,
                            code: req.body.code,
                            client_id: this.config.options.clientID,
                            client_secret: this.config.options.clientSecret,
                            redirect_uri: req.body.redirect_uri
                        }
                    }));
                    // Then create the session with Provider accessToken then generate new jwt as accessToken for client
                    // Query for the user info & generate new token for the requested scope
                    profile = yield SwaggerUiAuthProvider.queryGoogleProfile(token.access_token, token.token_type);
                }
                catch (ex) {
                    next(ex);
                }
                if (!!profile) {
                    this.verifyJwtToken(token.access_token, undefined, token, profile, (error, user, info) => {
                        if (error) {
                            next(error);
                        }
                        else {
                            // Return the token
                            try {
                                token.access_token = jwt.sign(user, this.jwtSecret, { expiresIn: token.expires_in });
                                //res.header('Set-Cookie', <any>this.jwtPaths.map(path => cookie.serialize('jwt', token.access_token, { path, expires: (<JwtToken>req.user).expires })));
                                res.send(token);
                            }
                            catch (ex) {
                                next(ex);
                            }
                        }
                    });
                }
            }
        });
    }
    static queryGoogleProfile(access_token, token_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield requestPromise('https://www.googleapis.com/plus/v1/people/me', {
                method: 'GET',
                headers: {
                    authorization: `${token_type || 'Bearer'} ${access_token}`
                }
            });
            let json;
            try {
                json = JSON.parse(body);
            }
            catch (ex) {
                throw new Error('Failed to parse user profile');
            }
            let profile = SwaggerUiAuthProvider.parseGoogleProfile(json);
            profile.provider = 'google';
            profile._raw = body;
            profile._json = json;
            return Promise.resolve(profile);
        });
    }
    static parseGoogleProfile(json) {
        if ('string' == typeof json) {
            json = JSON.parse(json);
        }
        let profile = {
            id: json.id,
            displayName: json.displayName
        };
        if (json.name) {
            profile.name = {
                familyName: json.name.familyName,
                givenName: json.name.givenName
            };
        }
        if (json.emails) {
            profile.emails = [];
            for (let i = 0, len = json.emails.length; i < len; ++i) {
                profile.emails.push({ value: json.emails[i].value, type: json.emails[i].type });
            }
        }
        if (json.image) {
            profile.photos = [{ value: json.image.url }];
        }
        profile.gender = json.gender;
        return profile;
    }
}
exports.SwaggerUiAuthProvider = SwaggerUiAuthProvider;
