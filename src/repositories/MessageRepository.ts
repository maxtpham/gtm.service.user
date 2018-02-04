import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@tm/lib.common";
import { MongoClient } from "@tm/lib.service";
import { Repository, RepositoryImpl } from "@tm/lib.service";
import { DefaultMongoClientTYPE } from "@tm/lib.service";
import { MessageEntity, MessageSchema } from '../entities/MessageEntity';

export interface MessageDocument extends MessageEntity, Document { }

export const MessageRepositoryTYPE = Symbol("MessageRepository");

export interface MessageRepository extends Repository<MessageEntity> {
}

@injectableSingleton(MessageRepositoryTYPE)
export class MessageRepositoryImpl extends RepositoryImpl<MessageDocument> implements MessageRepository {
    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "Message", MessageSchema);
    }
}