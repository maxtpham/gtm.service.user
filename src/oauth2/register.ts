import * as express from "express";
import { AuthParams } from "@gtm/lib.service.auth";
import { CreateJwtTokenFunction } from "./types";
import { normalizeOAuth2, IOAuth2Config } from "./config";
import * as auth from "@gtm/lib.service.auth";
import { registerSwaggerUiInternal } from "./SwaggerUi";
import { registerOAuth2Internal } from "./OAuth2Register";
import { registerAppToken } from "./AppToken";

/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 * @param app Express.js application instance
 * @param authParams Settings params for service's swagger registration
 * @param config OAuth2 config (everything from Google/FB)
 * @param createJwtToken Callback for OAuth2 to create a JwtToken (called by Passport.js)
 * @param oauth2BaseUrl The baseUrl for all links login, callback, failure; default to: /pub/auth. The login link will be /pub/auth/login/<provider>
 * @param oauth2LogoutUrl The UI link to logout user session, default to: /web/auth/logout
 */
export async function registerOAuth2(
    app: express.Application,
    authParams: AuthParams,
    config: IOAuth2Config,
    createJwtToken: CreateJwtTokenFunction,
    oauth2BaseUrl?: string,
    oauth2LogoutUrl?: string
) {
    // Normalize the config
    config = normalizeOAuth2(config);

    // Call to registration of standard Auth
    const defaultSwaggerConfigUrl = await auth.registerAuth(app, config, authParams, true);

    // Register Swagger-UI 
    await registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, createJwtToken);

    // Register JWT/OAuth2 with all supported passport.js Providers (Google, Facebook)
    Object.keys(config.auth).map((provider: string) => {
        registerOAuth2Internal(
            app, provider, config, createJwtToken,
            `${oauth2BaseUrl || '/pub/auth'}/login/${provider}`,
            `${oauth2BaseUrl || '/pub/auth'}/callback/${provider}`,
            `${oauth2BaseUrl || '/pub/auth'}/failure/${provider}`,
            oauth2LogoutUrl || '/web/auth/logout'
        );
        registerAppToken(
            app, provider, config, createJwtToken,
            `${oauth2BaseUrl || '/pub/auth'}/token/${provider}`
        );
    });
}