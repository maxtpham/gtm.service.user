import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put, } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@gtm/lib.service.auth';
import { UserRepository, UserRepositoryTYPE } from '../repositories/UserRepository';
import { MUserView, UserViewLite, UserViewFull } from '../views/MUserView';
import { UserEntity } from '../entities/UserEntity';

@injectableSingleton(UserApiController)
@Route('api/user/v1/user')
export class UserApiController extends ApiController {
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;

    /** Get user by Id */
    @Tags('User') @Security('jwt') @Get('{id}')
    public async getEntity(id: string): Promise<MUserView> {
        let user = await this.UserRepository.findOneById(id);
        if (user) {
            return Promise.resolve(this.UserRepository.buildClientRole(user));
        }
        return Promise.reject(`Not found.`);
    }


}