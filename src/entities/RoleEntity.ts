import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"

export interface RoleEntity extends DbEntity {
    name: string;

    /* Example: `*` OR `user:*` OR `subscription:*`,..  */
    scope?: string;
}

export const RoleSchema = {
    ...DbSchema,
    name: { type: mongoose.Schema.Types.String, required: true },
    scope: { type: mongoose.Schema.Types.String, required: false },
};