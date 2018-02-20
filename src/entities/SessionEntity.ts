import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"
import * as auth from "@gtm/lib.service.auth";

/**
 * Logged in Session object
 */
export interface SessionEntity extends DbEntity {
    /* Link to User document */
    userId: mongoose.Types.ObjectId;

    /* It's normally the provider access_token (to restore user session after loosing of the local login) */
    code: string;

    /** User's display name */
    name: string;

    /** List of Roles by code: user, manager, admin */
    roles?: string[];
    
    /* Granted auth scope */
    scope?: string;
    
    /* The lifetime in seconds of the token */
    expiresIn?: number;

    /* OAuth2 provider: google, facebook */
    provider?: auth.ProviderSession;
}

export const SessionSchema = {
    ...DbSchema,
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required: true },
    roles: { type: [mongoose.Schema.Types.String], required: false },
    scope: { type: mongoose.Schema.Types.String, required: false },
    expiresIn: { type: mongoose.Schema.Types.Number, required: false },
    provider: {
        _id: false,
        required: false,
        name: { type: mongoose.Schema.Types.String, required: true },
        access_token: { type: mongoose.Schema.Types.String, required: true },
        refresh_token: { type: mongoose.Schema.Types.String, required: false },
        expires_in: { type: mongoose.Schema.Types.Number, required: false },
        token_type: { type: mongoose.Schema.Types.String, required: true },
    }
};