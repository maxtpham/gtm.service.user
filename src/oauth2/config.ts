import { IAuthConfig } from "@gtm/lib.service.auth";

export interface IOAuth2Config extends IAuthConfig {
    /** root Url for OAuth2 app, normally the public Url to services.user */
    rootUrl: string;
    /** The default return url that will be redirected by OAuth2 for all case (logged in, logged out, logged failure) */
    returnUrl: string,
    /** OAuth2 provider specific config */
    auth: { [key: string]: IOAuth2ProviderConfig };
}

export interface IOAuth2ProviderConfig {
    authorizationUrl: string;
    tokenUrl: string;
    scope: string[];
    npm: {
        library: string;
        class: string;
    };
    options: IOAuth2ProviderOptionConfig;
}

export interface IOAuth2ProviderOptionConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback: true;
}

export function normalizeOAuth2(config: IOAuth2Config): IOAuth2Config {
    if (!config.rootUrl) config.rootUrl = (!!config.https ? config.https._url : config._url) || config._url;
    if (!config.returnUrl) config.returnUrl = '/';
    if (!config.auth) config.auth = { google: <IOAuth2ProviderConfig>{}, facebook: <IOAuth2ProviderConfig>{} };
    if (config.auth.google) {
        if (!config.auth.google.authorizationUrl) config.auth.google.authorizationUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        if (!config.auth.google.tokenUrl) config.auth.google.tokenUrl = 'https://www.googleapis.com/oauth2/v4/token';
        if (!config.auth.google.scope) config.auth.google.scope = ['profile', 'email'];
        if (!config.auth.google.npm) config.auth.google.npm = { library: 'passport-google-oauth', class: 'OAuth2Strategy' };
    }
    if (config.auth.facebook) {
        if (!config.auth.facebook.authorizationUrl) config.auth.facebook.authorizationUrl = 'https://www.facebook.com/dialog/oauth';
        if (!config.auth.facebook.tokenUrl) config.auth.facebook.tokenUrl = 'https://graph.facebook.com/oauth/access_token';
        if (!config.auth.facebook.scope) config.auth.facebook.scope = ['public_profile'];
        if (!config.auth.facebook.npm) config.auth.facebook.npm = { library: 'passport-facebook', class: 'Strategy' };
        if (config.auth.facebook.options && !(config.auth.facebook.options as any).profileFields) (config.auth.facebook.options as any).profileFields = ["id", "displayName", "photos", "name", "about", "age_range", "birthday", "currency", "devices", "education", "email", "interested_in", "is_shared_login", "is_verified", "languages", "install_type", "installed", "link", "locale", "location", "meeting_for", "name_format", "payment_pricepoints", "political", "public_key", "quotes", "relationship_status", "religion", "security_settings", "shared_login_upgrade_required_by", "significant_other", "sports", "test_group", "third_party_id", "timezone", "updated_time", "verified", "video_upload_limits", "viewer_can_send_gift", "website", "work", "favorite_athletes", "favorite_teams", "gender", "hometown", "inspirational_people", "cover"];
    }
    
    return config;
}

/**
    "rootUrl": "http://localhost:3001",
    "returnUrl": "http://localhost:30010/bin/dev",
    "auth": {
        "google": {
            "authorizationUrl": "https://accounts.google.com/o/oauth2/v2/auth",
            "tokenUrl": "https://www.googleapis.com/oauth2/v4/token",
            "scope": ["profile", "email"],
            "npm": {
                "library": "passport-google-oauth",
                "class": "OAuth2Strategy"
            },
            "options": {
                "clientID": "980942693683-uij086c1n3ar0cf8oin40ilunesb52au.apps.googleusercontent.com",
                "clientSecret": "NzD7eOzkcEh-ortZSXaHm3Kd"
            }
        },
        "facebook": {
            "authorizationUrl": "https://www.facebook.com/dialog/oauth",
            "tokenUrl": "https://graph.facebook.com/oauth/access_token",
            "scope": ["public_profile"],
            "npm": {
                "library": "passport-facebook",
                "class": "Strategy"
            },
            "options": {
                "clientID": "1983328695283502",
                "clientSecret": "cd595d42b38dbc0213e36f7eee740c88",
                "profileFields": ["id", "displayName", "photos", "name", "about", "age_range", "birthday", "currency", "devices", "education", "email", "interested_in", "is_shared_login", "is_verified", "languages", "install_type", "installed", "link", "locale", "location", "meeting_for", "name_format", "payment_pricepoints", "political", "public_key", "quotes", "relationship_status", "religion", "security_settings", "shared_login_upgrade_required_by", "significant_other", "sports", "test_group", "third_party_id", "timezone", "updated_time", "verified", "video_upload_limits", "viewer_can_send_gift", "website", "work", "favorite_athletes", "favorite_teams", "gender", "hometown", "inspirational_people", "cover"]
            }
        }
    },
 */