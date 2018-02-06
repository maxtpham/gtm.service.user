import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"

export interface RoleEntity extends DbEntity {
    code: string;

    /* Example: `*` OR `user:*` OR `subscription:*`,..  */
    scope?: string;
}

export const RoleSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    scope: { type: mongoose.Schema.Types.String, required: false },
};