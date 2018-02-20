import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { MessageEntity, MessageSchema } from '../entities/MessageEntity';

export interface MessageDocument extends MessageEntity, Document { }

export const MessageRepositoryTYPE = Symbol("MessageRepository");

export interface MessageRepository extends Repository<MessageEntity> {
}

@injectableSingleton(MessageRepositoryTYPE)
export class MessageRepositoryImpl extends RepositoryImpl<MessageDocument> implements MessageRepository {
    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "message", MessageSchema);
    }
}