import * as express from "express";
import * as passport from "passport";
import * as GoogleTokenStrategy from "passport-jwt-google-auth-library";
import * as FacebookTokenStrategy from "passport-facebook-token";
import { transform0 } from "./OAuth2Transform";
import { CreateJwtTokenFunction, VerifyJwtTokenFunction0 } from "./types";
import { IOAuth2ProviderOptionConfig, IOAuth2Config } from "./config";
import { ReturnUrlRequest, AuthHandler } from "./OAuth2Handler";
import { SwaggerUiAuthProvider } from "./SwaggerUiAuth";

export function registerAppToken(
    app: express.Application, provider: string, config: IOAuth2Config, createJwtToken: CreateJwtTokenFunction,
    url: string,
    requestHandler?: express.RequestHandler
) {
    switch (provider) {
        case 'google':
            return registerAppTokenGoogle(app, provider, config, createJwtToken, url, requestHandler);
        case 'facebook':
            return registerAppTokenFacebook(app, provider, config, createJwtToken, url, requestHandler);
    }
}

export function registerAppTokenGoogle(
    app: express.Application, provider: string, config: IOAuth2Config, createJwtToken: CreateJwtTokenFunction,
    url: string,
    requestHandler?: express.RequestHandler
) {
    passport.use(new GoogleTokenStrategy.Strategy({
        clientID: '162769265494-3q8o3gar8pjso775oq7kj3qfd8nreb45.apps.googleusercontent.com',//config.auth[provider].options.clientID,
        secretOrKey: '2NwIOtKbn21wYBq8tGlDKJS1', //config.auth[provider].options.clientSecret,
        jwtFromRequest: GoogleTokenStrategy.ExtractJwt.fromAuthHeader(),
        passReqToCallback: true
    }, new JwtGoogleAuthLibraryStrategyVerify(provider, createJwtToken).handler));

    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    const authHandler = new AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    app.post(url,
        passport.authenticate('jwt-google-auth-library', <passport.AuthenticateOptions>{ session: false }),
        !requestHandler ? [authHandler.loggedinHandler.bind(authHandler)] : [authHandler.loggedinHandler.bind(authHandler), requestHandler]
    );
}

export function registerAppTokenFacebook(
    app: express.Application, provider: string, config: IOAuth2Config, createJwtToken: CreateJwtTokenFunction,
    url: string,
    requestHandler?: express.RequestHandler
) {
    passport.use(new FacebookTokenStrategy(config.auth[provider].options, transform0(provider, createJwtToken)));

    // Handle the registered callback from provider after login completed (registered at the OAuth2 [options] above)
    const authHandler = new AuthHandler(config, provider, config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]));
    app.post(url,
        passport.authenticate('facebook-token', <passport.AuthenticateOptions>{ session: false }),
        !requestHandler ? [authHandler.loggedinHandler.bind(authHandler)] : [authHandler.loggedinHandler.bind(authHandler), requestHandler]
    );
}

type JwtGoogleAuthLibraryStrategyVerifyFunction =
    (request: express.Request, jwt_payload: string, done_callback: (error: any, user?: any, info?: any) => void) => void;

interface JwtPayload {
    // These six fields are included in all Google ID Tokens.
    iss: string; // "https://accounts.google.com",
    sub: string; // "110169484474386276334",
    azp: string; // "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
    aud: string; // "1008719970978-hb24n2dstb40o45d4feuo2ukqmcc6381.apps.googleusercontent.com",
    iat: string; // "1433978353",
    exp: string; // "1433981953",

    // These seven fields are only included when the user has granted the "profile" and
    // "email" OAuth scopes to the application.
    email: string; // "testuser@gmail.com",
    email_verified: string; // "true",
    name: string; // "Test User",
    picture: string; // "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
    given_name: string; // "Test",
    family_name: string; // "User",
    locale: string; // "en"
}

class JwtGoogleAuthLibraryStrategyVerify {

    private verifyJwtToken: VerifyJwtTokenFunction0;

    constructor(provider: string, createJwtToken: CreateJwtTokenFunction) {
        this.verifyJwtToken = transform0(provider, createJwtToken);
    }

    public get handler(): JwtGoogleAuthLibraryStrategyVerifyFunction { return this._handle.bind(this); }

    private async _handle(request: express.Request, jwt_payload: JwtPayload, done: (error: any, user?: any, info?: any) => void) {
        // Then create the session with Provider accessToken then generate new jwt as accessToken for client
        // Query for the user info & generate new token for the requested scope
        const profile = await SwaggerUiAuthProvider.queryGoogleProfile(request.body.accessToken);
        if (jwt_payload.picture) { // better photo
            profile.photos = [ { value: jwt_payload.picture } ]
        }
        this.verifyJwtToken(request.body.accessToken, undefined, profile, done);
    }
}