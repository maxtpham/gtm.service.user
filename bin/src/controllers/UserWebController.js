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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const UserRepository_1 = require("../repositories/UserRepository");
let UserWebController = class UserWebController extends lib_service_1.WebController {
    /**
     * Get current user Avatar
     */
    getAvatar(req, res, next) {
        return new Promise((resolve, reject) => {
            this.UserRepository.findOneById(req.user.user).then(userEntity => {
                if (!userEntity.avatar) {
                    res.sendStatus(404);
                    reject();
                }
                else {
                    res.contentType(userEntity.avatar.media);
                    res.end(userEntity.avatar.data.buffer, 'binary', resolve);
                }
            }).catch(e => reject(e));
        });
    }
};
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], UserWebController.prototype, "UserRepository", void 0);
__decorate([
    inversify_express_utils_1.httpGet('/avatar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserWebController.prototype, "getAvatar", null);
UserWebController = __decorate([
    inversify_express_utils_1.controller('/web/user')
], UserWebController);
exports.UserWebController = UserWebController;
