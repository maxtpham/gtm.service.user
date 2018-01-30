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
const lib_common_1 = require("@tm/lib.common");
const tsoa_1 = require("tsoa");
const lib_service_1 = require("@tm/lib.service");
const tsoa_2 = require("tsoa");
const RoleRepository_1 = require("../repositories/RoleRepository");
let RoleApiController = RoleApiController_1 = class RoleApiController extends lib_service_1.ApiController {
    getEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.RoleRepository.findOneById(id);
            if (role) {
                return Promise.resolve(role);
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
    tsoa_2.Tags('Role'), tsoa_2.Security('jwt'), tsoa_1.Get('{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleApiController.prototype, "getEntity", null);
RoleApiController = RoleApiController_1 = __decorate([
    lib_common_1.injectableSingleton(RoleApiController_1),
    tsoa_1.Route('api/user/v1/role')
], RoleApiController);
exports.RoleApiController = RoleApiController;
var RoleApiController_1;
