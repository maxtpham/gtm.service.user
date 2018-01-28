import * as express from 'express';
import { interfaces } from 'inversify';
import { IAppConfig } from './../config/AppConfig';

import { SystemApiController } from "./SystemApiController";
import { SessionApiController } from "./SessionApiController";
import { RoleApiController } from "./RoleApiController";

import { AuthWebController } from "./AuthWebController";

export async function register(app: express.Application, config: IAppConfig, iocContainer: interfaces.Container) {
    // IOC initialize for all web controllers manually (as no reference to them)
    AuthWebController.name;
}