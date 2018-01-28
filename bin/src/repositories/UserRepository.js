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
const lib_common_1 = require("@tm/lib.common");
const lib_service_1 = require("@tm/lib.service");
const lib_service_2 = require("@tm/lib.service");
const UserEntity_1 = require("../entities/UserEntity");
exports.UserRepositoryTYPE = Symbol("UserRepository");
let UserRepositoryImpl = class UserRepositoryImpl extends lib_service_1.RepositoryImpl {
    constructor(mongoclient) {
        super(mongoclient, "user", UserEntity_1.UserSchema);
    }
    getByProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find & update the user by code (profile.id)
            const tempUser = { updated: new Date(), profiles: {} };
            tempUser.updated = new Date();
            tempUser.name = profile.displayName;
            tempUser.profiles[profile.provider] = profile._json;
            let user;
            let users = yield this.find({ code: profile.id });
            if (users && users.length > 0 && users[0]._id) {
                // Check to update user (if name or profile is changed)
                let updatedUser = {};
                if (users[0].name !== tempUser.name) {
                    updatedUser.name = tempUser.name;
                    updatedUser.updated = new Date();
                }
                if (!users[0].profiles[profile.provider] || !deepEqual(users[0].profiles[profile.provider], tempUser.profiles[profile.provider], { strict: true })) {
                    updatedUser.profiles = {};
                    updatedUser.profiles[profile.provider] = tempUser.profiles[profile.provider];
                    updatedUser.updated = new Date();
                }
                user = !updatedUser.updated ? users[0] : yield this.findOneAndUpdate({ _id: users[0]._id }, updatedUser);
                if (updatedUser.updated) {
                    console.log(`Updated ${profile.provider} user profile`, user);
                }
            }
            else {
                // Create new user
                tempUser.code = profile.id;
                tempUser.updated = undefined;
                user = yield this.save(tempUser);
                console.log(`Created new ${profile.provider} user profile`, user);
            }
            return Promise.resolve(user);
        });
    }
};
UserRepositoryImpl = __decorate([
    lib_common_1.injectableSingleton(exports.UserRepositoryTYPE),
    __param(0, inversify_1.inject(lib_service_2.DefaultMongoClientTYPE)),
    __metadata("design:paramtypes", [Object])
], UserRepositoryImpl);
exports.UserRepositoryImpl = UserRepositoryImpl;
