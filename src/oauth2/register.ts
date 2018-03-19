import * as express from "express";
import { AuthParams } from "@gtm/lib.service.auth";
import { CreateJwtTokenFunction } from "./types";
import { normalizeOAuth2, IOAuth2Config } from "./config";
import * as auth from "@gtm/lib.service.auth";
import { registerSwaggerUiInternal } from "./SwaggerUi";
import { registerOAuth2Internal } from "./OAuth2Register";

export interface OAuth2Params {
    /** The callback to create the user token and persist to data store */
    createJwtToken: CreateJwtTokenFunction;

    oauth2?: OAuth2ParamUrls;
}

export interface OAuth2ParamUrls {
    /** The baseUrl for all links login, callback, failure; default to: /pub/auth. The login link will be /pub/auth/login/<provider> */
    baseUrl?: string;

    /** The UI link to logout user session, default to: /web/auth/logout */
    logoutUrl?: string,
}

/**
 * Register OAuth2/JWT & Swagger routes, this function will call register for standard Auth
 */
export async function registerOAuth2(app: express.Application, authParams: AuthParams, config: IOAuth2Config, params: OAuth2Params) {
    // Normalize the config
    config = normalizeOAuth2(config);

    // Call to registration of standard Auth
    const defaultSwaggerConfigUrl = await auth.registerAuth(app, config, authParams, true);

    // Register Swagger-UI 
    await registerSwaggerUiInternal(app, config, defaultSwaggerConfigUrl, params.createJwtToken);

    // Finally register JWT/OAuth2 with all supported passport.js Providers (Google, Facebook)
    Object.keys(config.auth).map((provider: string) => registerOAuth2Internal(
        app, provider, config, params.createJwtToken,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/login/${provider}`,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/callback/${provider}`,
        `${(params.oauth2 || <OAuth2ParamUrls>{}).baseUrl || '/pub/auth'}/failure/${provider}`,
        (params.oauth2 || <OAuth2ParamUrls>{}).logoutUrl || '/web/auth/logout'
    ));
}
