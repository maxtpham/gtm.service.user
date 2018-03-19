import * as express from 'express';

import { SwaggerUiHandler } from "./SwaggerUiHandler";
import { SwaggerUiAuth, SwaggerUiAuthProvider } from "./SwaggerUiAuth";
import { IOAuth2Config } from './config';
import { CreateJwtTokenFunction } from './types';

export async function registerSwaggerUiInternal(
    app: express.Application, config: IOAuth2Config,
    defaultSwaggerConfigUrl: string, createJwtToken: CreateJwtTokenFunction): Promise<void> {

    // Swagger UI handlers
    const uiHandler = new SwaggerUiHandler(config.rootUrl, config.swagger.baseUrl, defaultSwaggerConfigUrl);
    app.get(config.swagger.baseUrl, uiHandler.getRoot.bind(uiHandler));
    app.get(config.swagger.baseUrl + '/index.html', uiHandler.getIndex.bind(uiHandler));
    app.get(config.swagger.baseUrl + '/swagger-ui-bundle.js', uiHandler.getSwaggerUiBundle.bind(uiHandler));
    app.use(config.swagger.baseUrl, uiHandler.getStaticHandler());

    const uiAuth = new SwaggerUiAuth(config.swagger.baseUrl);
    app.get(config.swagger.baseUrl + '/redirect', uiAuth.redirect.bind(uiAuth));

    Object.keys(config.auth).map((provider: string) => {
        const uiAuthProvider = new SwaggerUiAuthProvider(config.swagger.baseUrl, provider, config.auth[provider], config.jwt.secret, config.jwt.paths.concat([config.swagger.baseUrl]), createJwtToken);
        app.get(config.swagger.baseUrl + '/authorization/' + provider, uiAuthProvider.getAuthorization.bind(uiAuthProvider));
        app.post(config.swagger.baseUrl + '/token/' + provider, uiAuthProvider.postToken.bind(uiAuthProvider));
    });
}