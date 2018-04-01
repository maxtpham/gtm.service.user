import { Document, SchemaDefinition } from "mongoose";
import { inject } from "inversify";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { RoleEntity, RoleSchema } from '../entities/RoleEntity';
import { RoleDetailView, MRoleView } from "../views/RoleView";

export interface RoleDocument extends RoleEntity, Document { }

export const RoleRepositoryTYPE = Symbol("RoleRepository");

export interface RoleRepository extends Repository<RoleEntity> {
    buildClientRole: (role: RoleEntity) => RoleDetailView;
    getRoleByType: (roleCode: string) => Promise<MRoleView>;
}

@injectableSingleton(RoleRepositoryTYPE)
export class RoleRepositoryImpl extends RepositoryImpl<RoleDocument> implements RoleRepository {

    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "role", RoleSchema);
    }

    public buildClientRole(role: RoleEntity): RoleDetailView {
        return <RoleDetailView>{
            id: role._id,
            code: role.code,
            scope: role.scope,
            status: role.status,
            created: role.created,
            updated: role.updated,
        }
    }

    public async getRoleByType(roleCode: string): Promise<MRoleView> {
        let role = await this.findOne({ code: roleCode });
        if (role) {
            return <MRoleView>{
                id: role.id,
                code: role.code
            };
        }
        throw new Error('Role code does not exist');
    }
}