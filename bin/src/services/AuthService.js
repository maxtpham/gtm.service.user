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
const lib_common_1 = require("@gtm/lib.common");
const lib_service_1 = require("@gtm/lib.service");
const SessionRepository_1 = require("../repositories/SessionRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AppConfig_1 = require("../config/AppConfig");
exports.AuthServiceTYPE = Symbol("AuthService");
let AuthServiceImpl = class AuthServiceImpl extends lib_service_1.ServiceImpl {
    /**
     * [OAuth2] Called by passport to give Provider tokens & profile after a successful authentication process
     * the system in turn will getOrCreate a UserProfile then return it to passport
     */
    createJwtToken(accessToken, refreshToken, providerSession, profile, profileExt, done) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwtToken;
            try {
                jwtToken = this.toJwtToken(yield this.createSession(accessToken, refreshToken, providerSession, profile, profileExt));
            }
            catch (ex) {
                done(ex, null, `Error while creating & updating ${profile.provider} session for user '${profile.displayName}' with ${profile.provider} token: ${accessToken}`);
            }
            if (jwtToken) {
                done(null, jwtToken);
            }
        });
    }
    toJwtToken(session) {
        return {
            name: session.name,
            roles: this.toJwtRoles(session.roles),
            scope: this.toJwtScope(session.scope),
            session: session._id.toHexString(),
            user: session.userId.toHexString(),
            expires: (session.created + (session.expiresIn || AppConfig_1.default.sessionExpires || 2592000) * 1000) // default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s)
        };
    }
    toJwtScope(sessionScope) {
        if (!sessionScope) {
            return {};
        }
        const scopeArray = sessionScope.split(' ');
        const jwtScope = {};
        for (let i of scopeArray) {
            i = i.trim();
            if (i === '*') {
                return null; // null is *, full permission
            }
            else if (i.length > 0) {
                jwtScope[i] = true;
            }
        }
        return jwtScope;
    }
    toJwtRoles(sessionRoles) {
        if (!sessionRoles || sessionRoles.length <= 0) {
            return {};
        }
        const jwtRoles = {};
        sessionRoles.forEach(sr => jwtRoles[sr] = true);
        return jwtRoles;
    }
    createSession(accessToken, refreshToken, providerSession, profile, profileExt) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the session with provided accessToken then restore in case user lost the current working token,but Provider still detect then return old token
            let session = yield this.SessionRepository.findOneAndUpdate({ code: accessToken }, {
                updated: Date.now(),
                provider: {
                    refresh_token: refreshToken,
                    expires_in: providerSession.expires_in
                }
            });
            if (session) {
                console.log(`Reuse existing ${profile.provider} session ${session._id} for user '${profile.displayName}' [${session.userId}]`);
                return Promise.resolve(session);
            }
            else {
                const user = yield this.UserRepository.getByProfile(profile, profileExt);
                // Create new session for the user
                session = yield this.SessionRepository.save({
                    userId: user._id,
                    code: accessToken,
                    name: user.name,
                    roles: !user.roles || user.roles.length <= 0 ? undefined : user.roles.map(ur => ur.code),
                    scope: '*',
                    expiresIn: AppConfig_1.default.sessionExpires || 2592000,
                    provider: {
                        name: profile.provider,
                        access_token: providerSession.access_token,
                        refresh_token: refreshToken,
                        expires_in: providerSession.expires_in,
                        token_type: providerSession.token_type
                    }
                });
                if (session) {
                    console.log(`Created new ${profile.provider} session ${session._id} for user '${user.name}' [${user._id}]`);
                    return Promise.resolve(session);
                }
                return Promise.reject(`Could not save the ${profile.provider} User session to database`);
            }
        });
    }
};
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], AuthServiceImpl.prototype, "UserRepository", void 0);
__decorate([
    inversify_1.inject(SessionRepository_1.SessionRepositoryTYPE),
    __metadata("design:type", Object)
], AuthServiceImpl.prototype, "SessionRepository", void 0);
AuthServiceImpl = __decorate([
    lib_common_1.injectableSingleton(exports.AuthServiceTYPE)
], AuthServiceImpl);
exports.AuthServiceImpl = AuthServiceImpl;
