import * as passport from "passport";
import { CreateJwtTokenFunction, VerifyJwtTokenFunction, VerifyJwtTokenFunction0, ProviderSession, OAuth2ProfileExt } from "./types";
import config from "../config/AppConfig";

/** to transform the Passport.profile into generic profile with some additional fields to store into system DB */
abstract class OAuth2ProfileTransform {
    protected verifyCb: CreateJwtTokenFunction;
    constructor(verifyCb: CreateJwtTokenFunction) {
        this.verifyCb = verifyCb;
    }

    public get handler0(): VerifyJwtTokenFunction0 { return this.handle0.bind(this); }
    public get handler(): VerifyJwtTokenFunction { return this.handle.bind(this); }

    protected abstract transform(profile: passport.Profile) : OAuth2ProfileExt;

    private async handle0(accessToken: string, refreshToken: string, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        await this.verifyCb(
            accessToken, refreshToken, {
                name: 'default',
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: config.sessionExpires || 2592000, // default to 15 minutes (900s), 30d (30d x 24h x 3600s = 2592000s)
                token_type: 'bearer'
            },
            profile, this.transform(profile), done);
    }
    private async handle(accessToken: string, refreshToken: string, providerSession: ProviderSession, profile: passport.Profile, done: (error: any, user?: any, info?: any) => void): Promise<void> {
        await this.verifyCb(accessToken, refreshToken, providerSession, profile, this.transform(profile), done);
    }
}

class GoogleOAuth2VerifyCallback extends OAuth2ProfileTransform {
    protected transform(profile: passport.Profile) : OAuth2ProfileExt {
        return <OAuth2ProfileExt>{
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: (<any>profile)._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : profile.photos[0].value,
            address: !(<any>profile)._json.placesLived || (<any>profile)._json.placesLived.length <= 0 ? (<any>profile)._json.url : (<any>profile)._json.placesLived[0].value,
            timezone: undefined,
            language: (<any>profile)._json.language
        };
    }
}

class FacebookOAuth2VerifyCallback extends OAuth2ProfileTransform {

    static locale2Language(locale: string): string {
        const pos = locale.indexOf('_');
        return pos <= 0 ? locale : locale.substr(0, pos);
    }

    protected transform(profile: passport.Profile) : OAuth2ProfileExt {
        return <OAuth2ProfileExt>{
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: (<any>profile)._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : profile.photos[0].value,
            address: (<any>profile)._json.profileUrl,
            timezone: (<any>profile)._json.timezone,
            language: !(<any>profile)._json.locale ? undefined : FacebookOAuth2VerifyCallback.locale2Language((<any>profile)._json.locale)
        };
    }
}

export function transform0(provider: string, verifyCb: CreateJwtTokenFunction): VerifyJwtTokenFunction0 {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler0;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler0;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}

export default function transform(provider: string, verifyCb: CreateJwtTokenFunction): VerifyJwtTokenFunction {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}