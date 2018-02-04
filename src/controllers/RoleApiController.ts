import { inject } from 'inversify';
import { injectableSingleton } from "@tm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@tm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { JwtToken } from '@tm/lib.service.auth';
import { RoleRepository, RoleRepositoryTYPE } from '../repositories/RoleRepository';
import { RoleView, RoleViewWithPagination } from '../views/RoleView';
import { RoleEntity } from '../entities/RoleEntity';

@injectableSingleton(RoleApiController)
@Route('api/user/v1/role')
export class RoleApiController extends ApiController {
    @inject(RoleRepositoryTYPE) private RoleRepository: RoleRepository;

    /** Get Roles */
    @Tags('Role') @Security('jwt') @Get()
    public async getEntities( @Query() query?: string, @Query() pageNumber?: number, @Query() itemCount?: number)
        : Promise<RoleViewWithPagination> {
        let queryToEntities = !!query ? {
            $and: [
                { $or: [{ name: query }, { scope: query }] },
                {
                    deleted: null
                }
            ]
        } : { deleted: null };
        let roles = await this.RoleRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
        if (roles) {
            let roleTotalItem = await this.RoleRepository.find({});
            let roleViews = <RoleViewWithPagination>{ roles, totalItems: roleTotalItem.length };
            return Promise.resolve(roleViews);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get Role by Id */
    @Tags('Role') @Security('jwt') @Get('{id}')
    public async getEntity(id: string): Promise<RoleEntity> {
        let role = await this.RoleRepository.findOneById(id);
        if (role) {
            return Promise.resolve(role);
        }
        return Promise.reject(`Not found.`);
    }

    /** Create New Role */
    @Tags('Role') @Security('jwt') @Post()
    public async createEntity( @Body() roleView: RoleView): Promise<RoleEntity> {
        let role = await this.RoleRepository.save(<RoleEntity>{ name: roleView.code, scope: roleView.scope });
        if (role) {
            return Promise.resolve(await this.RoleRepository.findOneById(role._id));
        }
        if (role instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Update Role */
    @Tags('Role') @Security('jwt') @Put('{id}')
    public async updateEntity(id: string, @Body() roleView: RoleView): Promise<RoleEntity> {
        let role = await this.RoleRepository.findOneAndUpdate({ _id: id }, <RoleEntity>{ name: roleView.code, scope: roleView.scope });
        if (role) {
            return Promise.resolve(await this.RoleRepository.findOneById(role._id));
        }
        if (role instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Delete Role */
    @Tags('Role') @Security('jwt') @Delete('{id}')
    public async deleteEntity(id: string): Promise<void> {
        let role = await this.RoleRepository.findOneAndUpdate({ _id: id }, { deleted: new Date() });
        if (role) {
            return Promise.resolve();
        }
        return Promise.reject(`Not found.`);
    }
}