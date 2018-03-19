import * as passport from "passport";
import * as GoogleTokenStrategy from "passport-jwt-google-auth-library";
import * as FacebookTokenStrategy from "passport-facebook-token";
import { transform0 } from "./OAuth2Transform";
import { CreateJwtTokenFunction } from "./types";

export function createPassportStrategy(provider: string, createJwtToken: CreateJwtTokenFunction): passport.Strategy {
    switch (provider) {
        case 'google':
            break;
        case 'facebook':
            return new FacebookTokenStrategy({
                    clientID: '',
                    clientSecret: '',
                    profileFields: ['']
                },
                transform0(provider, createJwtToken)
            );
    }
}
