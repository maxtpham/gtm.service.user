import * as express from 'express';
import { interfaces } from 'inversify';
import { IAppConfig } from './../config/AppConfig';

import { AccountApiController } from "./AccountApiController";
import { SystemApiController } from "./SystemApiController";
import { SessionApiController } from "./SessionApiController";
import { RoleApiController } from "./RoleApiController";
import { UserApiController } from "./UserApiController";

import { AuthWebController } from "./AuthWebController";
import { UserWebController } from "./UserWebController";

export async function register(app: express.Application, config: IAppConfig, iocContainer: interfaces.Container) {
    // IOC initialize for all web controllers manually (as no reference to them)
    AccountApiController.name;
    SystemApiController.name;
    SessionApiController.name;
    RoleApiController.name;
    UserApiController.name;

    AuthWebController.name;
    UserWebController.name;
}