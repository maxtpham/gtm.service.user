import "reflect-metadata"; // TypeError: Reflect.hasOwnMetadata is not a function
import * as express from 'express';
import { interfaces } from 'inversify';

import { iocContainer } from "@gtm/lib.common";
import * as common from "@gtm/lib.service";

import * as controllers from "./controllers/index";
import { default as config, IAppConfig } from './config/AppConfig';
import { AuthService, AuthServiceTYPE, AuthServiceImpl } from "./services/AuthService";
import { registerOAuth2 } from "./oauth2/register";
import { CreateJwtTokenFunction } from "./oauth2/types";

export function main(test?: common.InitAppFunction) {
    common.main({
        projectRoot: __dirname,
        moduleConfig: config,
        mongoConfig: config,
        iocContainer,
        test,
        created,
        apiRootUrl: '/api/user'
    });
}

async function created(app: express.Application, config: IAppConfig, iocContainer: interfaces.Container)  {
    // Register OAuth2/JWT & Swagger routes
    const authService = iocContainer.get<AuthService>(AuthServiceTYPE);
    await registerOAuth2(
        app, {
            swaggerBaseDir: __dirname,
            jwtIgnoreUrls: ['/api/user/v1/system/loggedin', '/web/auth/session', '/web/auth/jwt']
        },
        config,
        (<CreateJwtTokenFunction>authService.createJwtToken).bind(authService)
    );

    // Register Web/Controllers
    await controllers.register(app, config, iocContainer);
}