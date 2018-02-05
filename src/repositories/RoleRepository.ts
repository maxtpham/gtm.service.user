import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { RoleEntity, RoleSchema } from '../entities/RoleEntity';

export interface RoleDocument extends RoleEntity, Document { }

export const RoleRepositoryTYPE = Symbol("RoleRepository");

export interface RoleRepository extends Repository<RoleEntity> {
}

@injectableSingleton(RoleRepositoryTYPE)
export class RoleRepositoryImpl extends RepositoryImpl<RoleDocument> implements RoleRepository {
    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "Role", RoleSchema);
    }
}