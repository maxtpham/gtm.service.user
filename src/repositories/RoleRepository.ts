import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@tm/lib.common";
import { MongoClient } from "@tm/lib.service";
import { Repository, RepositoryImpl } from "@tm/lib.service";
import { DefaultMongoClientTYPE } from "@tm/lib.service";
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