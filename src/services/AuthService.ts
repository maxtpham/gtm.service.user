import { inject, injectable } from "inversify";
import * as passport from "passport";
import * as mongoose from "mongoose";

import { injectableSingleton } from "@gtm/lib.common";
import { Service, ServiceImpl } from "@gtm/lib.service";
import { JwtToken } from "@gtm/lib.service.auth";
import { SessionEntity, SessionSchema } from '../entities/SessionEntity';
import { SessionRepository, SessionRepositoryTYPE } from '../repositories/SessionRepository';
import { UserEntity } from "../entities/UserEntity";
import { UserRepository, UserRepositoryTYPE } from '../repositories/UserRepository';
import config from "../config/AppConfig";
import { ProviderSession, OAuth2ProfileExt } from "../oauth2/types";

export const AuthServiceTYPE = Symbol("AuthService");

export interface AuthService extends Service {
    createJwtToken(accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt, done: (error: any, user?: any, info?: any) => void): Promise<void>;
    toJwtToken(session: SessionEntity): JwtToken;
    createSession(accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<SessionEntity>;
}

@injectableSingleton(AuthServiceTYPE)
export class AuthServiceImpl extends ServiceImpl implements AuthService {
    @inject(UserRepositoryTYPE) private UserRepository: UserRepository;
    @inject(SessionRepositoryTYPE) private SessionRepository: SessionRepository;

    /**
     * [OAuth2] Called by passport to give Provider tokens & profile after a successful authentication process
     * the system in turn will getOrCreate a UserProfile then return it to passport
     */
    public async createJwtToken(accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        let jwtToken: JwtToken;
        try {
            jwtToken = this.toJwtToken(await this.createSession(accessToken, refreshToken, providerSession, profile, profileExt));
        }
        catch (ex) {
            done(ex, null, `Error while creating & updating ${profile.provider} session for user '${profile.displayName}' with ${profile.provider} token: ${accessToken}`);
        }
        if (jwtToken) {
            done(null, jwtToken);
        }
    }

    public toJwtToken(session: SessionEntity): JwtToken {
        return <JwtToken>{
            name: session.name,
            roles: this.toJwtRoles(session.roles),
            scope: this.toJwtScope(session.scope),
            session: (<mongoose.Types.ObjectId>session._id).toHexString(),
            user: session.userId.toHexString(),
            expires: (session.created + (session.expiresIn || config.sessionExpires || 2592000) * 1000) // default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s)
        };
    }

    private toJwtScope(sessionScope?: string): {[key: string]: boolean} {
        if (!sessionScope) {
            return {};
        }
        const scopeArray = sessionScope.split(' ');
        const jwtScope = {};
        for (let i of scopeArray) {
            i = i.trim();
            if (i === '*') {
                return null; // null is *, full permission
            } else if (i.length > 0) {
                jwtScope[i] = true;
            }
        }
        return jwtScope;
    }

    private toJwtRoles(sessionRoles?: string[]): {[key: string]: boolean} {
        if (!sessionRoles || sessionRoles.length <= 0) {
            return {};
        }
        const jwtRoles = {};
        sessionRoles.forEach(sr => jwtRoles[sr] = true);
        return jwtRoles;
    }
    
    public async createSession(accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<SessionEntity> {
        // Find the session with provided accessToken then restore in case user lost the current working token,but Provider still detect then return old token
        let session = await this.SessionRepository.findOneAndUpdate({ code: accessToken }, <SessionEntity>{
            updated: Date.now(),
            provider: {
                refresh_token: refreshToken,
                expires_in: providerSession.expires_in
            }
        });
        if (session) {
            console.log(`Reuse existing ${profile.provider} session ${session._id} for user '${profile.displayName}' [${session.userId}]`);
        } else {
            const user: UserEntity = await this.UserRepository.getByProfile(profile, profileExt);
            
            // Create new session for the user
            session = await this.SessionRepository.save(<SessionEntity>{
                userId: user._id,
                code: accessToken,
                name: user.name,
                roles: !user.roles || user.roles.length <= 0 ? undefined : user.roles.map(ur => ur.code),
                scope: '*',
                expiresIn: config.sessionExpires || 2592000, // default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s)
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
    }
}