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
const AppConfig_1 = require("./../config/AppConfig");
const tsoa_2 = require("tsoa");
const UserRepository_1 = require("../repositories/UserRepository");
const MUserView_1 = require("../views/MUserView");
const UserEntity_1 = require("../entities/UserEntity");
const RoleView_1 = require("../views/RoleView");
const RoleRepository_1 = require("../repositories/RoleRepository");
const coreClient = require("@scg/lib.client.core");
const bson_1 = require("bson");
const AccountRepository_1 = require("../repositories/AccountRepository");
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
    findUser(mUserFind) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = [];
            if (mUserFind.name !== "") {
                userEntity = yield this.UserRepository.find({ name: RegExp(mUserFind.name) });
            }
            else if (mUserFind.phone) {
                userEntity = yield this.UserRepository.find({ phone: RegExp(mUserFind.phone) });
            }
            else if (mUserFind.email) {
                userEntity = yield this.UserRepository.find({ email: RegExp(mUserFind.email) });
            }
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
    /** Update user with profiles */
    updateAvatar(avatar, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let users = yield this.UserRepository.findOne({ _id: req.user.user });
                if (!users) {
                    return Promise.reject("User not exist");
                }
                let bf = new Buffer(avatar.data.toString(), "base64");
                let av = {
                    media: avatar.media,
                    data: new bson_1.Binary(bf, bson_1.Binary.SUBTYPE_BYTE_ARRAY)
                };
                users.avatar = av;
                users.updated = new Date().getTime();
                let userSave = yield this.UserRepository.findOneAndUpdate({ _id: req.user.user }, users);
                if (userSave) {
                    console.log("Update avartar success " + userSave._id);
                    return Promise.resolve(userSave);
                }
            }
            catch (e) {
                console.log(e);
                Promise.reject(`User not exist`);
            }
        });
    }
    /** Get users with pagination */
    getEntities(status, userId, pageNumber, itemCount) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryToEntities = this.UserRepository.buildQuery(status, userId);
            let users = yield this.UserRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
            if (users) {
                let userTotalItems = yield this.UserRepository.find(queryToEntities);
                let userDetailViews = [];
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    let userAccount = yield this.AccountRepository.findOne({ userId: user._id });
                    userDetailViews.push(UserEntity_1.User.toDetailViews(user, userAccount || null));
                })));
                let userViews = { users: userDetailViews, totalItems: userTotalItems.length };
                return Promise.resolve(userViews);
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Get user details by Id */
    getDetailViewById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.findOneById(id);
            if (userEntity) {
                let userAccount = yield this.AccountRepository.findOne({ userId: userEntity._id });
                return Promise.resolve(UserEntity_1.User.toDetailViews(userEntity, userAccount || null));
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Create or update User Role */
    createOrUpdateUserRole(userRoleView, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const coreApi = new coreClient.LendApi(AppConfig_1.default.services.core, req.cookies.jwt);
            try {
                let user = yield this.UserRepository.findOneById(userRoleView.userId);
                if (!user) {
                    return Promise.reject("User does not exist");
                }
                if (!(userRoleView.roleType in RoleView_1.RoleType)) {
                    return Promise.reject(`Role type ${userRoleView.roleType} does not exist`);
                }
                let roleLookup = yield this.RoleRepository.getRoleByType(RoleView_1.RoleType[userRoleView.roleType]);
                let userUpdated;
                if (user.roles && user.roles.some(us => us.code == RoleView_1.RoleType[userRoleView.roleType])) {
                    // Update if this role is existed and updated in role entity
                    user.roles.map(ur => {
                        if (ur.id == roleLookup.id) {
                            ur.id = roleLookup.id,
                                ur.code = roleLookup.code;
                        }
                    });
                }
                else {
                    user.roles.push({ id: roleLookup.id, code: roleLookup.code });
                }
                userUpdated = yield this.UserRepository.findOneAndUpdate({ _id: userRoleView.userId }, user);
                if (userUpdated) {
                    return Promise.resolve(UserEntity_1.User.toProfileView(yield this.UserRepository.findOneById(userRoleView.userId)));
                }
                return Promise.reject('Not found.');
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    /** Create or update User Role */
    createOrUpdateUserRoleMobile(roleType, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const lenderApi = new coreClient.LendApi(AppConfig_1.default.services.core, req.cookies.jwt);
            let userIdCurrent = req.user.user;
            try {
                let user = yield this.UserRepository.findOneById(userIdCurrent);
                if (!user) {
                    return Promise.reject("User does not exist");
                }
                if (!(roleType in RoleView_1.RoleType)) {
                    return Promise.reject(`Role type ${roleType} does not exist`);
                }
                try {
                    let roleLookup = yield this.RoleRepository.getRoleByType(roleType + "");
                    let userUpdated;
                    if (user.roles && user.roles.some(us => us.code == RoleView_1.RoleType[roleType])) {
                        // Update if this role is existed and updated in role entity
                        user.roles.map(ur => {
                            if (ur.id == roleLookup.id) {
                                ur.id = roleLookup.id,
                                    ur.code = roleLookup.code;
                            }
                        });
                    }
                    else {
                        user.roles.push({ id: roleLookup.id, code: roleLookup.code });
                    }
                    user.isFirstLogin = true;
                    userUpdated = yield this.UserRepository.findOneAndUpdate({ _id: userIdCurrent }, user);
                    if (roleType === RoleView_1.RoleType.Lender) {
                        let lender = yield lenderApi.addLend();
                        if (!lender) {
                            Promise.reject("Dont create lender");
                        }
                    }
                    if (userUpdated) {
                        return Promise.resolve(UserEntity_1.User.toProfileView(yield this.UserRepository.findOneById(userIdCurrent)));
                    }
                    return Promise.reject('Not found.');
                }
                catch (e) {
                    console.log("role dont exists");
                    return Promise.reject(e);
                }
            }
            catch (error) {
                console.log("Loi cmr");
                return Promise.reject(error);
            }
        });
    }
    /** Update user details */
    updateUserDetail(userId, userDetails, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.UserRepository.findOneById(userId);
                if (!user) {
                    return Promise.reject('User is not found.');
                }
                user.active = userDetails.status === MUserView_1.UserStatus.New ? null : (userDetails.status === MUserView_1.UserStatus.Active ? true : false);
                user.status = userDetails.status || user.status;
                user.name = userDetails.name || user.name;
                user.phone = userDetails.phone || user.phone;
                user.birthday = userDetails.birthday || user.birthday;
                user.roles = userDetails.role || user.roles;
                user.email = userDetails.email || user.email;
                user.address = userDetails.address || user.address;
                user.gender = userDetails.address || user.gender;
                // if (userDetails.avatar && userDetails.avatar != user.avatar) {
                //     let bf = new Buffer(userDetails.avatar.data.toString(), "base64");
                //     let newAvatar: AttachmentView = {
                //         media: userDetails.avatar.media,
                //         data: new Binary(bf, Binary.SUBTYPE_BYTE_ARRAY)
                //     };
                //     user.avatar = newAvatar;
                // }
                user.updated = Date.now();
                let userToUpdate = yield this.UserRepository.findOneAndUpdate({ _id: userId }, user);
                if (user) {
                    return Promise.resolve(yield this.UserRepository.findOneById(userId));
                }
            }
            catch (e) {
                console.log(e);
                Promise.reject(`User not exist`);
            }
        });
    }
};
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], UserApiController.prototype, "UserRepository", void 0);
__decorate([
    inversify_1.inject(RoleRepository_1.RoleRepositoryTYPE),
    __metadata("design:type", Object)
], UserApiController.prototype, "RoleRepository", void 0);
__decorate([
    inversify_1.inject(AccountRepository_1.AccountRepositoryTYPE),
    __metadata("design:type", Object)
], UserApiController.prototype, "AccountRepository", void 0);
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
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/find-user'),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "findUser", null);
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
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/update-avatar'),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateAvatar", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/entities'),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()), __param(2, tsoa_1.Query()), __param(3, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getEntities", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/details/{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getDetailViewById", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/create-or-update-role'),
    __param(0, tsoa_1.Body()), __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "createOrUpdateUserRole", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/create-or-update-role-mobile'),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "createOrUpdateUserRoleMobile", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/update-user-details/{userId}'),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateUserDetail", null);
UserApiController = UserApiController_1 = __decorate([
    lib_common_1.injectableSingleton(UserApiController_1),
    tsoa_1.Route('api/user/v1/user')
], UserApiController);
exports.UserApiController = UserApiController;
var UserApiController_1;
