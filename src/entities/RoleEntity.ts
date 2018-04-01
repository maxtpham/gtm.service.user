import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"
import { RoleStatus } from "../views/RoleView";

export interface RoleEntity extends DbEntity {
    code: string;

    /* Example: `*` OR `user:*` OR `subscription:*`,..  */
    scope?: string;

    /**Role status */
    status?: RoleStatus;
}

export const RoleSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    status: { type: mongoose.Schema.Types.Number, required: true },
    scope: { type: mongoose.Schema.Types.String, required: false },
};