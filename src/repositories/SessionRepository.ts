import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { SessionEntity, SessionSchema } from '../entities/SessionEntity';

export interface SessionDocument extends SessionEntity, Document { }

export const SessionRepositoryTYPE = Symbol("SessionRepository");

export interface SessionRepository extends Repository<SessionEntity> {
    buildQuery: (userId?: string) => any;
}

@injectableSingleton(SessionRepositoryTYPE)
export class SessionRepositoryImpl extends RepositoryImpl<SessionDocument> implements SessionRepository {
    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "session", SessionSchema);
    }

    public buildQuery(userId?: string) {
        let queryToEntities;
        if (!!userId) {
            queryToEntities = {
                $and: [
                    {
                        deleted: null
                    }
                ]
            };

            if (!!userId) {
                queryToEntities.$and.push({ userId: userId });
            }

        } else {
            queryToEntities = {
                deleted: null
            }
        }

        return queryToEntities;
    }
}