"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const lib_common_1 = require("@gtm/lib.common");
const tsoa_1 = require("tsoa");
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const RoleRepository_1 = require("../repositories/RoleRepository");
let RoleApiController = RoleApiController_1 = class RoleApiController extends lib_service_1.ApiController {
    /** Get Roles */
    getEntities(query, pageNumber, itemCount, sortName, sortType) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryToEntities = !!query ? {
                $and: [
                    { $or: [{ code: { $regex: query, $options: 'i' } }, { scope: { $regex: query, $options: 'i' } }] },
                    {
                        deleted: null
                    }
                ]
            } : { deleted: null };
            let sort = { name: sortName, type: sortType || -1 };
            let roles = yield this.RoleRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5, sort);
            if (roles) {
                let roleTotalItems = yield this.RoleRepository.find(queryToEntities);
                let roleDetailViews = [];
                roles.map(role => {
                    roleDetailViews.push(this.RoleRepository.buildClientRole(role));
                });
                let roleViews = { roles: roleDetailViews, totalItems: roleTotalItems.length };
                return Promise.resolve(roleViews);
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Get Role by Id */
    getEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.RoleRepository.findOneById(id);
            if (role) {
                return Promise.resolve(this.RoleRepository.buildClientRole(role));
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Create New Role */
    createEntity(roleView) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.RoleRepository.save({ code: roleView.code, scope: roleView.scope });
            if (role) {
                return Promise.resolve(this.RoleRepository.buildClientRole(yield this.RoleRepository.findOneById(role._id)));
            }
            if (role instanceof Error) {
                return Promise.reject('Error');
            }
        });
    }
    /** Update Role */
    updateEntity(id, roleView) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.RoleRepository.findOneAndUpdate({ _id: id }, { code: roleView.code, scope: roleView.scope, updated: Date.now() });
            if (role) {
                return Promise.resolve(this.RoleRepository.buildClientRole(yield this.RoleRepository.findOneById(role._id)));
            }
            if (role instanceof Error) {
                return Promise.reject('Error');
            }
        });
    }
    /** Delete Role */
    deleteEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.RoleRepository.findOneAndUpdate({ _id: id }, { deleted: Date.now() });
            if (role) {
                return Promise.resolve('DELETE request to homepage');
            }
            return Promise.reject(`Not found.`);
        });
    }
};
__decorate([
    inversify_1.inject(RoleRepository_1.RoleRepositoryTYPE),
    __metadata("design:type", Object)
], RoleApiController.prototype, "RoleRepository", void 0);
__decorate([
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Get(),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Query()), __param(2, tsoa_1.Query()),
    __param(3, tsoa_1.Query()), __param(4, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "getEntities", null);
__decorate([
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Get('{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "getEntity", null);
__decorate([
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Post(),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "createEntity", null);
__decorate([
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Post('{id}'),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "updateEntity", null);
__decorate([
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Delete('{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "deleteEntity", null);
RoleApiController = RoleApiController_1 = __decorate([
    lib_common_1.injectableSingleton(RoleApiController_1),
    tsoa_1.Route('api/user/v1/role')
], RoleApiController);
exports.RoleApiController = RoleApiController;
var RoleApiController_1;
