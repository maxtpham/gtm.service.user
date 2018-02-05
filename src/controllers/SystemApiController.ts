import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';

@injectableSingleton(SystemApiController)
@Route('api/user/v1/system')
export class SystemApiController extends ApiController {

    /** Get current system version info */
    @Tags('System')@Security('jwt')@Post('version')
    public async getVersion(): Promise<string> {
        return Promise.resolve(config._version);
    }

    /** Check loggedin status */
    @Tags('System')@Security('jwt')@Get('loggedin')
    public async getLoggedin(@Request() req: express.Request): Promise<boolean> {
        return Promise.resolve(req.user && (!!(<JwtToken>req.user).session));
    }
}
