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
const deepEqual = require('deep-equal');
const inversify_1 = require("inversify");
const lib_common_1 = require("@gtm/lib.common");
const lib_service_1 = require("@gtm/lib.service");
const lib_service_2 = require("@gtm/lib.service");
const UserEntity_1 = require("../entities/UserEntity");
const lib_service_auth_1 = require("@gtm/lib.service.auth");
exports.UserRepositoryTYPE = Symbol("UserRepository");
let UserRepositoryImpl = class UserRepositoryImpl extends lib_service_1.RepositoryImpl {
    constructor(mongoclient) {
        super(mongoclient, "user", UserEntity_1.UserSchema);
    }
    getByProfile(profile, profileExt) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find & update the user by code (profile.id)
            let user;
            let users = yield this.find({ code: profile.id });
            if (users && users.length > 0 && users[0]._id) {
                // Check to update user (if name or profile is changed)
                let updatedUser = {};
                const currentUser = users[0];
                const currentProfile = currentUser.profiles[profile.provider];
                if (currentProfile && deepEqual(currentProfile, profile._json, { strict: true })) {
                    user = currentUser;
                }
                else {
                    if (currentUser.code !== profileExt.id)
                        updatedUser.code = profileExt.id;
                    if (currentUser.name !== profileExt.name && currentUser.name === currentProfile.name)
                        updatedUser.name = profileExt.name;
                    if (currentUser.provider !== profile.provider)
                        updatedUser.provider = profile.provider;
                    if (currentUser.email !== profileExt.email && currentUser.email === currentProfile.email)
                        updatedUser.email = profileExt.email;
                    if (currentUser.gender !== profileExt.gender && currentUser.gender === currentProfile.gender)
                        updatedUser.gender = profileExt.gender;
                    if (!currentUser.avatar && profileExt.avatar)
                        updatedUser.avatar = yield lib_service_auth_1.Utils.fetchPhoto(profileExt.avatar);
                    if (currentUser.address !== profileExt.address && currentUser.address === currentProfile.address)
                        updatedUser.address = profileExt.address;
                    if (currentUser.timezone !== profileExt.timezone && currentUser.timezone === currentProfile.timezone)
                        updatedUser.timezone = profileExt.timezone;
                    if (currentUser.language !== profileExt.language && currentUser.language === currentProfile.language)
                        updatedUser.language = profileExt.language;
                    updatedUser.profiles = { [profile.provider]: profile._json };
                    updatedUser.updated = Date.now();
                    user = yield this.findOneAndUpdate({ _id: currentUser._id }, updatedUser);
                    console.log(`Updated ${profile.provider} user profile`, user);
                }
            }
            else {
                // Create new user
                user = yield this.save({
                    code: profileExt.id,
                    name: profileExt.name,
                    provider: profile.provider,
                    profiles: { [profile.provider]: profile._json },
                    email: profileExt.email,
                    gender: profileExt.gender,
                    avatar: yield lib_service_auth_1.Utils.fetchPhoto(profileExt.avatar),
                    address: profileExt.address,
                    timezone: profileExt.timezone,
                    language: profileExt.language,
                });
                console.log(`Created new ${profile.provider} user profile`, user);
            }
            return Promise.resolve(user);
        });
    }
    buildQuery(status, userId) {
        let queryToEntities;
        if (!!status || !!userId) {
            queryToEntities = {
                $and: [
                    {
                        deleted: null
                    }
                ]
            };
            if (!!status) {
                let statusToInt = parseInt(status);
                let statusMap = isNaN(statusToInt) ? 0 : statusToInt;
                queryToEntities.$and.push({ status: status });
            }
            if (!!userId) {
                queryToEntities.$and.push({ _id: userId });
            }
        }
        else {
            queryToEntities = {
                deleted: null
            };
        }
        return queryToEntities;
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = yield this.find({ name: RegExp(name) });
            return Promise.resolve(users);
        });
    }
    buildClientUser(user) {
        return {
            id: user._id,
            name: user.name,
            phone: user.phone,
            houseHolder: user.profiles.default ? user.profiles.default.houseHolder : ""
        };
    }
    buildClientUsers(users) {
        let mUsers = [];
        users.forEach((item) => {
            mUsers.push({
                id: item._id,
                name: item.name,
                phone: item.phone
            });
        });
        return mUsers;
    }
    getUserRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.findOneById(id);
            if (user) {
                return user.roles;
            }
            throw new Error("User not found");
        });
    }
};
UserRepositoryImpl = __decorate([
    lib_common_1.injectableSingleton(exports.UserRepositoryTYPE),
    __param(0, inversify_1.inject(lib_service_2.DefaultMongoClientTYPE)),
    __metadata("design:paramtypes", [Object])
], UserRepositoryImpl);
exports.UserRepositoryImpl = UserRepositoryImpl;
