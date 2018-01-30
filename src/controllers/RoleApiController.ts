import { inject } from 'inversify';
import { injectableSingleton } from "@tm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@tm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@tm/lib.service.auth';
import { RoleRepository, RoleRepositoryTYPE } from '../repositories/RoleRepository';

@injectableSingleton(RoleApiController)
@Route('api/user/v1/role')
export class RoleApiController extends ApiController {
    @inject(RoleRepositoryTYPE) private RoleRepository: RoleRepository;

    @Tags('Role')@Security('jwt')@Get('{id}')
    public async getEntity(id: string) {
        let role = await this.RoleRepository.findOneById(id);
        if (role) {
            return Promise.resolve(role);
        }
        return Promise.reject(`Not found.`);
    }
}