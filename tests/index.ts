import * as express from 'express';
import { interfaces } from "inversify";

import { main } from './../src/main';
import { testRepositories } from "./repositories/index";

main(async (app: express.Application, config: any, iocContainer: interfaces.Container) => {
    await testRepositories(app, iocContainer);
});