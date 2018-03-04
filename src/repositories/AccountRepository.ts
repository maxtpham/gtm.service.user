import { Document, SchemaDefinition } from "mongoose";
const deepEqual = require('deep-equal');
import { inject } from "inversify";
import * as passport from "passport";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { AccountEntity, AccountSchema } from '../entities/AccountEnity';
import { Utils, OAuth2ProfileExt } from "@gtm/lib.service.auth";

export interface AccountDocument extends AccountEntity, Document { }

export const AccountRepositoryTYPE = Symbol("AccountRepository");

export interface AccountRepository extends Repository<AccountEntity> {
    /** Get or create User by passport Profile. If User exists, compare and update changes */
}

@injectableSingleton(AccountRepositoryTYPE)
export class AccountRepositoryImpl extends RepositoryImpl<AccountDocument> implements AccountRepository {

    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "account", AccountSchema);
    }

}