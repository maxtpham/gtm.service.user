import "reflect-metadata"; // TypeError: Reflect.hasOwnMetadata is not a function
import * as express from 'express';
import { interfaces } from 'inversify';

import { iocContainer } from "@gtm/lib.common";
import * as common from "@gtm/lib.service";
import * as auth from "@gtm/lib.service.auth";

import * as controllers from "./controllers/index";
import { default as config, IAppConfig } from './config/AppConfig';
import { AuthService, AuthServiceTYPE } from "./services/AuthService";
import { CreateJwtTokenFunction } from "@gtm/lib.service.auth";

export function main(test?: common.InitAppFunction) {
    common.main(__dirname, config, config, iocContainer, test, async (app: express.Application, config: IAppConfig, iocContainer: interfaces.Container) => {
        // Register OAuth2/JWT & Swagger routes
        const authService = iocContainer.get<AuthService>(AuthServiceTYPE);
        await auth.registerOAuth2(app, config, {
            createJwtToken: (<CreateJwtTokenFunction>authService.createJwtToken).bind(authService),
            swaggerBaseDir: __dirname,
            jwtIgnoreUrls: ['/api/user/v1/system/loggedin', '/web/auth/session', '/web/auth/jwt']
        });
    
        // Register Web/Controllers
        await controllers.register(app, config, iocContainer);
    });
}