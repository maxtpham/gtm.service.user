import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { SessionViewWithPagination, SessionView, SessionModule } from '../views/SessionView';
import { SessionRepositoryTYPE, SessionRepository } from '../repositories/SessionRepository';
import { UserRepositoryTYPE, UserRepository } from '../repositories/UserRepository';

@injectableSingleton(SessionApiController)
@Route('api/user/v1/session')
export class SessionApiController extends ApiController {
    @inject(SessionRepositoryTYPE) private SessionRepository: SessionRepository;
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;

    /** Check current session info */
    @Tags('Session') @Security('jwt') @Get('current')
    public async getCurrent(@Request() req: express.Request): Promise<JwtToken> {
        return Promise.resolve(!req.user ? undefined : <JwtToken>req.user);
    }

    /** Get sessions with pagination */
    @Tags('Session') @Security('jwt') @Get('/entities')
    public async getEntities(@Query() userId?: string, @Query() pageNumber?: number, @Query() itemCount?: number)
        : Promise<SessionViewWithPagination> {
        let queryToEntities = this.SessionRepository.buildQuery(userId);
        let sessions = await this.SessionRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
        if (sessions) {
            let sessionTotalItems = await this.SessionRepository.find(queryToEntities);
            let sessionDetailViews: SessionView[] = [];
            await Promise.all(sessions.map(async session => {
                let user = await this.UserRepository.findOneById(session.userId.toHexString());
                sessionDetailViews.push(SessionModule.toSession(session, user ? user.roles : null));
            }));
            let sessionViews = <SessionViewWithPagination>{ sessions: sessionDetailViews, totalItems: sessionTotalItems.length };
            return Promise.resolve(sessionViews);
        }
        return Promise.reject(`Not found.`);
    }
}