import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@tm/lib.common";
import { MongoClient } from "@tm/lib.service";
import { Repository, RepositoryImpl } from "@tm/lib.service";
import { DefaultMongoClientTYPE } from "@tm/lib.service";
import { SessionEntity, SessionSchema } from '../entities/SessionEntity';

export interface SessionDocument extends SessionEntity, Document { }

export const SessionRepositoryTYPE = Symbol("SessionRepository");

export interface SessionRepository extends Repository<SessionEntity> {
}

@injectableSingleton(SessionRepositoryTYPE)
export class SessionRepositoryImpl extends RepositoryImpl<SessionDocument> implements SessionRepository {
    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "session", SessionSchema);
    }
}