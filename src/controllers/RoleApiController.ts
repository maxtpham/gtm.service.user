import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put, } from 'tsoa';
import * as express from 'express';
import { ApiController } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { RoleRepository, RoleRepositoryTYPE } from '../repositories/RoleRepository';
import { RoleView, RoleViewWithPagination, RoleDetailView } from '../views/RoleView';
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
                { $or: [{ code: { $regex: query, $options: 'i' } }, { scope: { $regex: query, $options: 'i' }}] },
                {
                    deleted: null
                }
            ]
        } : { deleted: null };
        let roles = await this.RoleRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
        if (roles) {
            let roleTotalItems = await this.RoleRepository.find(queryToEntities);
            let roleDetailViews: RoleDetailView[] = [];
            roles.map(role => {
                roleDetailViews.push(this.RoleRepository.buildClientRole(role));
            })
            let roleViews = <RoleViewWithPagination>{ roles: roleDetailViews, totalItems: roleTotalItems.length };
            return Promise.resolve(roleViews);
        }
        return Promise.reject(`Not found.`);
    }

    /** Get Role by Id */
    @Tags('Role') @Security('jwt') @Get('{id}')
    public async getEntity(id: string): Promise<RoleDetailView> {
        let role = await this.RoleRepository.findOneById(id);
        if (role) {
            return Promise.resolve(this.RoleRepository.buildClientRole(role));
        }
        return Promise.reject(`Not found.`);
    }

    /** Create New Role */
    @Tags('Role') @Security('jwt') @Post()
    public async createEntity( @Body() roleView?: RoleView): Promise<RoleDetailView> {
        let role = await this.RoleRepository.save(<RoleEntity>{ code: roleView.code, scope: roleView.scope });
        if (role) {
            return Promise.resolve(this.RoleRepository.buildClientRole(await this.RoleRepository.findOneById(role._id)));
        }
        if (role instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Update Role */
    @Tags('Role') @Security('jwt') @Put('{id}')
    public async updateEntity(id: string, @Body() roleView?: RoleView): Promise<RoleDetailView> {
        let role = await this.RoleRepository.findOneAndUpdate({ _id: id }, <RoleEntity>{ code: roleView.code, scope: roleView.scope });
        if (role) {
            return Promise.resolve(this.RoleRepository.buildClientRole(await this.RoleRepository.findOneById(role._id)));
        }
        if (role instanceof Error) {
            return Promise.reject('Error');
        }
    }

    /** Delete Role */
    @Tags('Role') @Security('jwt') @Delete('{id}')
    public async deleteEntity(id: string): Promise<string> {
        let role = await this.RoleRepository.findOneAndUpdate({ _id: id }, { deleted: Date.now() });
        if (role) {
            return Promise.resolve('DELETE request to homepage');
        }
        return Promise.reject(`Not found.`);
    }
}