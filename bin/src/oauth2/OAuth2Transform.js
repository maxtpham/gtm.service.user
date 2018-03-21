"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppConfig_1 = require("../config/AppConfig");
/** to transform the Passport.profile into generic profile with some additional fields to store into system DB */
class OAuth2ProfileTransform {
    constructor(verifyCb) {
        this.verifyCb = verifyCb;
    }
    get handler0() { return this.handle0.bind(this); }
    get handler() { return this.handle.bind(this); }
    handle0(accessToken, refreshToken, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyCb(accessToken, refreshToken, {
                name: 'default',
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: AppConfig_1.default.sessionExpires || 2592000,
                token_type: 'bearer'
            }, profile, this.transform(profile), done);
        });
    }
    handle(accessToken, refreshToken, providerSession, profile, done) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyCb(accessToken, refreshToken, providerSession, profile, this.transform(profile), done);
        });
    }
}
class GoogleOAuth2VerifyCallback extends OAuth2ProfileTransform {
    transform(profile) {
        return {
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: profile._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : profile.photos[0].value,
            address: !profile._json.placesLived || profile._json.placesLived.length <= 0 ? profile._json.url : profile._json.placesLived[0].value,
            timezone: undefined,
            language: profile._json.language
        };
    }
}
class FacebookOAuth2VerifyCallback extends OAuth2ProfileTransform {
    static locale2Language(locale) {
        const pos = locale.indexOf('_');
        return pos <= 0 ? locale : locale.substr(0, pos);
    }
    transform(profile) {
        return {
            id: profile.id,
            name: profile.displayName,
            email: !profile.emails || profile.emails.length <= 0 ? undefined : profile.emails[0].value,
            gender: profile._json.gender,
            avatar: !profile.photos || profile.photos.length <= 0 ? undefined : profile.photos[0].value,
            address: profile._json.profileUrl,
            timezone: profile._json.timezone,
            language: !profile._json.locale ? undefined : FacebookOAuth2VerifyCallback.locale2Language(profile._json.locale)
        };
    }
}
function transform0(provider, verifyCb) {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler0;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler0;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}
exports.transform0 = transform0;
function transform(provider, verifyCb) {
    switch (provider) {
        case 'facebook':
            return new FacebookOAuth2VerifyCallback(verifyCb).handler;
        case 'google':
            return new GoogleOAuth2VerifyCallback(verifyCb).handler;
        default:
            throw new Error('Not supported provider: ' + provider);
    }
}
exports.default = transform;
