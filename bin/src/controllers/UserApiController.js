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
var UserApiController_1;
const inversify_1 = require("inversify");
const lib_common_1 = require("@gtm/lib.common");
const tsoa_1 = require("tsoa");
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const UserRepository_1 = require("../repositories/UserRepository");
const MUserView_1 = require("../views/MUserView");
const UserEntity_1 = require("../entities/UserEntity");
const RoleView_1 = require("../views/RoleView");
const RoleRepository_1 = require("../repositories/RoleRepository");
const bson_1 = require("bson");
var Mongoose = require('mongoose'), Schema = Mongoose.Schema;
let UserApiController = UserApiController_1 = class UserApiController extends lib_service_1.ApiController {
    /** Export all users */
    exportProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.UserRepository.exportProfiles();
        });
    }
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
    /**Get lend user for app */
    getLenderUserForApp(find) {
        return __awaiter(this, void 0, void 0, function* () {
            let queries = {
                $and: [
                    {
                        roles: { $elemMatch: { code: RoleView_1.RoleType[RoleView_1.RoleType.Lender] } }
                    },
                    {
                        $or: [
                            { email: RegExp(find) },
                            { phone: RegExp(find) },
                            { name: RegExp(find) }
                        ],
                    }
                ]
            };
            let userEntity = yield this.UserRepository.find(queries);
            if (userEntity) {
                return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    findUser(find) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = [];
            userEntity = yield this.UserRepository.find({
                $or: [
                    { email: RegExp(find) },
                    { phone: RegExp(find) },
                    { name: RegExp(find) }
                ]
            });
            if (userEntity) {
                return Promise.resolve(this.UserRepository.buildClientUsers(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    findUserByPhone(find) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.find({ phone: RegExp(find) });
            if (userEntity.length > 1) {
                let userFind = {
                    status: MUserView_1.StatusFindByPhone.Exception,
                    user: null,
                };
                return userFind;
            }
            if (userEntity.length <= 0) {
                let userFind = {
                    status: MUserView_1.StatusFindByPhone.Fail,
                    user: null,
                };
                return userFind;
            }
            if (userEntity.length === 1) {
                let userFind = {
                    status: MUserView_1.StatusFindByPhone.Success,
                    user: {
                        id: userEntity[0]._id,
                        birthday: userEntity[0].birthday,
                        email: userEntity[0].email,
                        gender: userEntity[0].gender,
                        houseHolder: userEntity[0].profileDefault ? userEntity[0].profileDefault.houseHolder : "",
                        name: userEntity[0].name,
                        phone: userEntity[0].phone
                    },
                };
                return userFind;
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
    getProfileCurrentForMobile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let userEntity = yield this.UserRepository.findOneById(req.user.user);
            if (userEntity) {
                return Promise.resolve(UserEntity_1.User.toProfileViewForMobile(userEntity));
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
            let userProfile = yield this.UserRepository.findOne({ _id: req.user.user });
            if (!userProfile) {
                return Promise.reject("User not exist");
            }
            const { job, bankRate, note, infos, name, identityCard, address, birthday, gender, localtion, phone, houseHolder } = profile;
            userProfile.profileDefault = {
                bankRate: bankRate || (userProfile.profileDefault ? userProfile.profileDefault.bankRate : 0),
                job: job || (userProfile.profileDefault ? userProfile.profileDefault.job : ''),
                infos: infos || (userProfile.profileDefault ? userProfile.profileDefault.infos : ''),
                note: note || (userProfile.profileDefault ? userProfile.profileDefault.note : ''),
                identityCard: identityCard || (userProfile.profileDefault ? userProfile.profileDefault.identityCard : ''),
                houseHolder: houseHolder || (userProfile.profileDefault ? userProfile.profileDefault.houseHolder : ''),
            };
            userProfile.name = name || userProfile.name;
            userProfile.birthday = birthday || userProfile.birthday;
            userProfile.address = address || userProfile.address;
            userProfile.gender = gender || userProfile.gender;
            userProfile.location = localtion || (userProfile.location || { x: 0, y: 0 });
            userProfile.phone = phone || userProfile.phone;
            userProfile.updated = new Date().getTime();
            let userSave = yield this.UserRepository.update({ _id: req.user.user }, userProfile);
            if (userSave) {
                return Promise.resolve(UserEntity_1.User.toProfileViewForMobile(yield this.UserRepository.findOneById(userProfile._id)));
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** setFCMForMobile */
    setFCMForMobile(fcms, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.UserRepository.findOne({ _id: req.user.user });
            if (!users) {
                return Promise.reject("User not exist");
            }
            users.fcmToken = fcms.fcmToken;
            users.updated = new Date().getTime();
            let userSave = yield this.UserRepository.update({ _id: req.user.user }, users);
            if (userSave) {
                return Promise.resolve("Tạo FCM thành công");
            }
            return Promise.reject(`Tạo FCM không thành công`);
        });
    }
    /** getFCMForMobile */
    getFCMForMobile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.UserRepository.findOne({ _id: userId });
            if (!users) {
                return Promise.reject("User not exist");
            }
            if (users.fcmToken) {
                let fcmView = {
                    fcmToken: users.fcmToken,
                };
                return Promise.resolve(fcmView);
            }
            return Promise.reject(`Chưa Tạo FCM`);
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
    getEntities(status, userId, pageNumber, itemCount, sortName, sortType) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryToEntities = this.UserRepository.buildQuery(status, userId);
            let sort = { name: sortName, type: sortType || -1 };
            let users = yield this.UserRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5, sort);
            if (users) {
                let userTotalItems = yield this.UserRepository.find(queryToEntities);
                let userDetailViews = [];
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    userDetailViews.push(UserEntity_1.User.toDetailViews(user));
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
                return Promise.resolve(UserEntity_1.User.toDetailViews(userEntity));
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Create or update User Role */
    createOrUpdateUserRole(userRoleView, req) {
        return __awaiter(this, void 0, void 0, function* () {
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
                else { // Create new role
                    user.roles.push({ id: roleLookup.id, code: roleLookup.code });
                }
                user.isFirstLogin = false;
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
    /** Update user details */
    updateUserDetail(userId, userDetails, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.UserRepository.findOneById(userId);
                if (!user) {
                    return Promise.reject('User is not found.');
                }
                if (user.status == MUserView_1.UserStatus.Active && userDetails.status == MUserView_1.UserStatus.New) {
                    return Promise.reject(`Can not update user status ${MUserView_1.UserStatus[user.status]} to ${MUserView_1.UserStatus[userDetails.status]}`);
                }
                user.active = userDetails.status == MUserView_1.UserStatus.New ? null : (userDetails.status == MUserView_1.UserStatus.Active ? true : false);
                user.status = userDetails.status;
                user.name = userDetails.name || user.name;
                user.phone = userDetails.phone || user.phone;
                user.birthday = userDetails.birthday || user.birthday;
                user.roles = userDetails.role || user.roles;
                user.email = userDetails.email || user.email;
                user.address = userDetails.address || user.address;
                user.gender = userDetails.gender || user.gender;
                user.updated = Date.now();
                let userToUpdate = yield this.UserRepository.findOneAndUpdate({ _id: userId }, user);
                if (user) {
                    return Promise.resolve(yield this.UserRepository.findOneById(userId));
                }
            }
            catch (error) {
                console.log(error);
                Promise.reject(error);
            }
        });
    }
    /** Get user account */
    getUserAccount(req, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userAccount = yield this.UserRepository.findAndGetOneById(userId, 'account');
            if (!userAccount.account) {
                return Promise.reject('User account not found');
            }
            return Promise.resolve(UserEntity_1.User.toUserAccountView(userAccount));
        });
    }
    /** Update user account */
    updateUserAccount(req, userId, userAccountView, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userAccount = yield this.UserRepository.findAndGetOneById(userId, 'account');
                if (!userAccount.account) {
                    return Promise.reject('User account not found');
                }
                if (userAccountView.bonus && userAccount.account.bonus != userAccountView.bonus) {
                    userAccount.account.bonus = userAccountView.bonus;
                }
                if (type == 'Deposit') {
                    userAccount.account.balance = userAccountView && userAccountView.balance ? (userAccount.account.balance + userAccountView.balance) : userAccount.account.balance;
                    userAccount.account.balanceGold = userAccount.account.balanceGold ? (userAccount.account.balanceGold + userAccountView.balanceGold) : userAccountView.balanceGold;
                }
                if (type == 'WithDraw') {
                    if (userAccountView.balance > userAccount.account.balance && userAccountView.balanceGold > userAccount.account.balanceGold) {
                        return Promise.reject(`The account balance ${userAccount.account.balance} is not enough to perform this transaction`);
                    }
                    userAccount.account.balance = userAccountView && userAccountView.balance ? (userAccount.account.balance - userAccountView.balance) : userAccount.account.balance;
                    userAccount.account.balanceGold = userAccount.account.balanceGold ? (userAccount.account.balanceGold - userAccountView.balanceGold) : userAccountView.balanceGold;
                }
                userAccount.updated = Date.now();
                let userUpdated = yield this.UserRepository.findOneAndUpdate({ _id: userId }, userAccount);
                if (userUpdated) {
                    return Promise.resolve(UserEntity_1.User.toUserAccountView(yield this.UserRepository.findAndGetOneById(userId, 'account')));
                }
            }
            catch (e) {
                console.log(e);
                Promise.reject(e);
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
    tsoa_2.Tags('User'), tsoa_2.Security({ 'jwt': ['admin'] }), tsoa_1.Get('/profiles/export'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "exportProfiles", null);
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
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/get-lender-for-app'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getLenderUserForApp", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/find-user'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "findUser", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/find-user-by-phone'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "findUserByPhone", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/profile'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getProfileCurrent", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/profile-for-mobile'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getProfileCurrentForMobile", null);
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
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/set-fcm-for-mobile'),
    __param(0, tsoa_1.Body()),
    __param(1, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "setFCMForMobile", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/get-fcm-for-mobile'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getFCMForMobile", null);
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
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()),
    __param(2, tsoa_1.Query()), __param(3, tsoa_1.Query()),
    __param(4, tsoa_1.Query()), __param(5, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, Number]),
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
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/update-user-details/{userId}'),
    __param(1, tsoa_1.Body()),
    __param(2, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateUserDetail", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Get('/get-user-account/{userId}'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "getUserAccount", null);
__decorate([
    tsoa_2.Tags('User'), tsoa_2.Security('jwt'), tsoa_1.Post('/update-user-account/{userId}'),
    __param(0, tsoa_1.Request()),
    __param(2, tsoa_1.Body()),
    __param(3, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], UserApiController.prototype, "updateUserAccount", null);
UserApiController = UserApiController_1 = __decorate([
    lib_common_1.injectableSingleton(UserApiController_1),
    tsoa_1.Route('api/user/v1/user')
], UserApiController);
exports.UserApiController = UserApiController;
