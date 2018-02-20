import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { RoleEntity, RoleSchema } from '../entities/RoleEntity';
import { RoleDetailView } from "../views/RoleView";

export interface RoleDocument extends RoleEntity, Document { }

export const RoleRepositoryTYPE = Symbol("RoleRepository");

export interface RoleRepository extends Repository<RoleEntity> {
    buildClientRole: (role: RoleEntity) => RoleDetailView;
}

@injectableSingleton(RoleRepositoryTYPE)
export class RoleRepositoryImpl extends RepositoryImpl<RoleDocument> implements RoleRepository {
    constructor( @inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "role", RoleSchema);
    }

    public buildClientRole(role: RoleEntity): RoleDetailView {
        return <RoleDetailView>{
            id: role._id,
            code: role.code,
            scope: role.scope,
            created: role.created,
            updated: role.updated,
        }
    }
}