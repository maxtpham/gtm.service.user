import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"

export interface MessageEntity extends DbEntity {
    userId: string;
    toUserId: string;
    content: string;
    delivered?: Date;
}

export const MessageSchema = {
    ...DbSchema,
    userId: { type: mongoose.Schema.Types.String, required: true },
    toUserId: { type: mongoose.Schema.Types.String, required: true },
    content: { type: mongoose.Schema.Types.String, required: true },
    delivered: { type: mongoose.Schema.Types.Date, required: false },
};