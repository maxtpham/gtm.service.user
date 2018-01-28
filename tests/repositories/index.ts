import * as express from 'express';
import { interfaces } from "inversify";

import { UserRepositoryTest } from "./UserRepositoryTest";

export async function testRepositories(app: express.Application, iocContainer: interfaces.Container): Promise<void> {

    iocContainer.bind<UserRepositoryTest>(UserRepositoryTest).toSelf();
    await iocContainer.resolve<UserRepositoryTest>(UserRepositoryTest).run();

    return Promise.resolve();
}