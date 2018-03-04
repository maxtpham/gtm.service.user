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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const lib_common_1 = require("@gtm/lib.common");
const tsoa_1 = require("tsoa");
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const UserRepository_1 = require("../repositories/UserRepository");
const UserEntity_1 = require("../entities/UserEntity");
var Mongoose = require('mongoose'), Schema = Mongoose.Schema;
let UserApiController = UserApiController_1 = class UserApiController extends lib_service_1.ApiController {
    /** Get all user lite */
    getUserLite() {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.find({});
            if (userEntity) {
                return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Get user by Id */
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.findOneById(id);
            if (userEntity) {
                return Promise.resolve(this.UserRepository.buildClientUser(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    getUserByName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.getByName(userName);
            if (userEntity) {
                return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    getProfileCurrent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.findOneById(req.user.user);
            if (userEntity) {
                return Promise.resolve(UserEntity_1.User.toProfileView(userEntity));
            }
            return Promise.reject(`Not found`);
        });
    }
    updateProfileCurrent(profileView, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { roles, code, provider, active } = profileView, updatingProfileView = __rest(profileView, ["roles", "code", "provider", "active"]);
            console.log(updatingProfileView);
            let oldUserEntity = yield this.UserRepository.findOneAndUpdate({ _id: req.user.user }, Object.assign({}, updatingProfileView, { updated: Date.now() }));
            if (!oldUserEntity) {
                return Promise.reject('Not found');
            }
            if (oldUserEntity instanceof Error) {
                return Promise.reject(oldUserEntity);
            }
            return Promise.resolve(UserEntity_1.User.toProfileView(yield this.UserRepository.findOneById(req.user.user)));
        });
    }
    /** Update user with profiles */
    updateUserProfiles(profile, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.UserRepository.findOne({ _id: req.user.user });
            if (!users) {
                return Promise.reject("User not exist");
            }
            const { job, bankRate, note, infos, name, identityCard, address, birthday, gender, localtion, phone, houseHolder } = profile;
            const { roles, code, provider, active, profiles } = users;
            const { google, facebook } = profiles;
            users.profiles = {
                google: google ? google : "",
                facebook: facebook ? facebook : "",
                default: {
                    bankRate: bankRate ? bankRate : "",
                    job: job ? job : "",
                    infos: infos ? infos : "",
                    note: note ? note : "",
                    identityCard: identityCard ? identityCard : "",
                    houseHolder: houseHolder
                }
            };
            name ? (users.name = name) : "";
            birthday ? (users.birthday = birthday) : 0;
            address ? (users.address = address) : "";
            gender ? (users.gender = gender) : "";
            localtion ? (users.location = localtion) : { x: 0, y: 0 };
            phone ? (users.phone = phone) : "";
            users.updated = new Date().getTime();
            let userSave = yield this.UserRepository.update({ _id: req.user.user }, users);
            if (userSave) {
                return Promise.resolve(users);
            }
            return Promise.reject(`Not found.`);
        });
    }
};
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], UserApiController.prototype, "UserRepository", void 0);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/get-user-lite'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getUserLite", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/getById/{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getById", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/get-by-user-name'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getUserByName", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/profile'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getProfileCurrent", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/profile'),
    __param(0, tsoa_1.Body()), __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateProfileCurrent", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/update-user-profiles'),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateUserProfiles", null);
UserApiController = UserApiController_1 = __decorate([
    lib_common_1.injectableSingleton(UserApiController_1),
    tsoa_1.Route('api/user/v1/user')
], UserApiController);
exports.UserApiController = UserApiController;
var UserApiController_1;
