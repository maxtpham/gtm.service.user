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
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const SessionView_1 = require("../views/SessionView");
const SessionRepository_1 = require("../repositories/SessionRepository");
const UserRepository_1 = require("../repositories/UserRepository");
let SessionApiController = SessionApiController_1 = class SessionApiController extends lib_service_1.ApiController {
    /** Check current session info */
    getCurrent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(!req.user ? undefined : req.user);
        });
    }
    /** Get sessions with pagination */
    getEntities(userId, pageNumber, itemCount) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryToEntities = this.SessionRepository.buildQuery(userId);
            let sessions = yield this.SessionRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
            if (sessions) {
                let sessionTotalItems = yield this.SessionRepository.find(queryToEntities);
                let sessionDetailViews = [];
                yield Promise.all(sessions.map((session) => __awaiter(this, void 0, void 0, function* () {
                    let user = yield this.UserRepository.findOneById(session.userId.toHexString());
                    sessionDetailViews.push(SessionView_1.SessionModule.toSession(session, user ? user.roles : null));
                })));
                let sessionViews = { sessions: sessionDetailViews, totalItems: sessionTotalItems.length };
                return Promise.resolve(sessionViews);
            }
            return Promise.reject(`Not found.`);
        });
    }
};
__decorate([
    inversify_1.inject(SessionRepository_1.SessionRepositoryTYPE),
    __metadata("design:type", Object)
], SessionApiController.prototype, "SessionRepository", void 0);
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], SessionApiController.prototype, "UserRepository", void 0);
__decorate([
    tsoa_2.Tags('Session'), tsoa_2.Security('jwt'), tsoa_1.Get('current'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionApiController.prototype, "getCurrent", null);
__decorate([
    tsoa_2.Tags('Session'), tsoa_2.Security('jwt'), tsoa_1.Get('/entities'),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()), __param(2, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], SessionApiController.prototype, "getEntities", null);
SessionApiController = SessionApiController_1 = __decorate([
    lib_common_1.injectableSingleton(SessionApiController_1),
    tsoa_1.Route('api/user/v1/session')
], SessionApiController);
exports.SessionApiController = SessionApiController;
var SessionApiController_1;
