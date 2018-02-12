import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"

export interface UserEntity extends DbEntity {
    /* Provider profile id (FB/Google id) */
    code: string;

    /* Provider profile username */
    name: string;

    /* Provider profile data */
    profiles?: any;

    roleCode: String;

    status: number;

}

export const UserSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required: true },
    profiles: { type: mongoose.Schema.Types.Mixed, required: false },
    roleCode: { type: mongoose.Schema.Types.String, required: true },
    status: { type: mongoose.Schema.Types.Number, required: true },
};