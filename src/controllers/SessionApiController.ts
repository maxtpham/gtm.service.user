import { inject } from 'inversify';
import { injectableSingleton } from "@tm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@tm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@tm/lib.service.auth';

@injectableSingleton(SessionApiController)
@Route('api/v1/session')
export class SessionApiController extends ApiController {

    /** Check current session info */
    @Tags('Session')@Security('jwt')@Get('current')
    public async getCurrent(@Request() req: express.Request): Promise<JwtToken> {
        return Promise.resolve(!req.user ? undefined : <JwtToken>req.user);
    }
}