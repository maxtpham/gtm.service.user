import * as passport from "passport";

export interface ProviderSession {
    name: string;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

export interface OAuth2ProfileExt {
    id: string;
    name?: string;
    email?: string;
    gender?: string;
    avatar?: string;
    address?: string;
    timezone?: number;
    language?: string;
}

export type CreateJwtTokenFunction =
    (accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, profileExt: OAuth2ProfileExt, done: (error: any, user?: any, info?: any) => void) => Promise<void>;

export type VerifyJwtTokenFunction =
    (accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void) => Promise<void>;

export type VerifyJwtTokenFunction0 =
    (accessToken: string, refreshToken: string, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void) => Promise<void>;
