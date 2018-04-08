import { inject } from 'inversify';
import { injectableSingleton } from "@gtm/lib.common";
import { Get, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller, Request, Response, Delete, Put, } from 'tsoa';
import * as express from 'express';
import { ApiController, Sort, SortType } from "@gtm/lib.service";
import config from './../config/AppConfig';
import { Security, Tags } from "tsoa";
import { RoleRepository, RoleRepositoryTYPE } from '../repositories/RoleRepository';
import { RoleView, RoleViewWithPagination, RoleDetailView, RoleStatus } from '../views/RoleView';
import { RoleEntity } from '../entities/RoleEntity';

@injectableSingleton(RoleApiController)
@Route('api/user/v1/role')
export class RoleApiController extends ApiController {
    @inject(RoleRepositoryTYPE) private RoleRepository: RoleRepository;

    /** Get Roles */
    @Tags('Role') @Security('jwt') @Get()
    public async getEntities(@Query() query?: string,
        @Query() pageNumber?: number, @Query() itemCount?: number,
        @Query() sortName?: string, @Query() sortType?: number,
    )
        : Promise<RoleViewWithPagination> {
        let queryToEntities = !!query ? {
            $and: [
                { $or: [{ code: { $regex: query, $options: 'i' } }, { scope: { $regex: query, $options: 'i' } }] },
                {
                    deleted: null
                }
            ]
        } : { deleted: null };
        let sort: Sort = { name: sortName, type: <SortType>sortType || -1 };
        let roles = await this.RoleRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5, sort);
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
    public async createEntity(@Body() roleView?: RoleView): Promise<RoleDetailView> {
        try {
            let role = await this.RoleRepository.save(<RoleEntity>{ code: roleView.code, scope: roleView.scope, status: roleView.status });
            if (role) {
                return Promise.resolve(this.RoleRepository.buildClientRole(await this.RoleRepository.findOneById(role._id)));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /** Update Role */
    @Tags('Role') @Security('jwt') @Post('{id}')
    public async updateEntity(id: string, @Body() roleView?: RoleView): Promise<RoleDetailView> {
        try {
            let currentRole = await this.RoleRepository.findOne({ _id: id, deleted: null });
            if (!currentRole) {
                return Promise.reject(`Role ${id} not found`);
            }

            if (currentRole.status == RoleStatus.Active) {
                return Promise.reject(`Could not update role with status ${RoleStatus[currentRole.status]}`);
            }

            let roleUpdated = await this.RoleRepository.findOneAndUpdate({ _id: id }, <RoleEntity>{ code: roleView.code, scope: roleView.scope, status: roleView.status, updated: Date.now() });
            if (roleUpdated) {
                return Promise.resolve(this.RoleRepository.buildClientRole(await this.RoleRepository.findOneById(roleUpdated._id)));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /** Delete Role */
    @Tags('Role') @Security('jwt') @Delete('{id}')
    public async deleteEntity(id: string): Promise<string> {
        try {
            let currentRole = await this.RoleRepository.findOne({ _id: id, deleted: null });
            if (!currentRole) {
                return Promise.reject(`Role ${id} not found`);
            }

            if (currentRole.status == RoleStatus.Active) {
                return Promise.reject(`Could not delete role with status ${RoleStatus[currentRole.status]}`);
            }
            let role = await this.RoleRepository.findOneAndUpdate({ _id: id }, { deleted: Date.now() });
            if (role) {
                return Promise.resolve('DELETE request to homepage');
            }
            return Promise.reject(`Not found.`);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}