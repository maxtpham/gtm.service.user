import { Document, SchemaDefinition } from "mongoose";
const deepEqual = require('deep-equal');
import { inject } from "inversify";
import * as passport from "passport";

import { injectableSingleton } from "@tm/lib.common";
import { MongoClient } from "@tm/lib.service";
import { Repository, RepositoryImpl } from "@tm/lib.service";
import { DefaultMongoClientTYPE } from "@tm/lib.service";
import { UserEntity, UserSchema } from '../entities/UserEntity';

export interface UserDocument extends UserEntity, Document { }

export const UserRepositoryTYPE = Symbol("UserRepository");

export interface UserRepository extends Repository<UserEntity> {
    /** Get or create User by passport Profile. If User exists, compare and update changes */
    getByProfile(profile: passport.Profile): Promise<UserEntity>;
}

@injectableSingleton(UserRepositoryTYPE)
export class UserRepositoryImpl extends RepositoryImpl<UserDocument> implements UserRepository {

    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "user", UserSchema);
    }

    public async getByProfile(profile: passport.Profile): Promise<UserEntity> {
        // Find & update the user by code (profile.id)
        const tempUser = <UserEntity>{ updated: Date.now(), profiles: { } };
        tempUser.updated = Date.now();
        tempUser.name = profile.displayName;
        tempUser.profiles[profile.provider] = (<any>profile)._json;
        let user: UserEntity;
        let users = await (<UserRepository>this).find({ code: profile.id });
        if (users && users.length > 0 && users[0]._id) {
            // Check to update user (if name or profile is changed)
            let updatedUser: UserEntity = <UserEntity>{ };
            if (users[0].name !== tempUser.name) {
                updatedUser.name = tempUser.name;
                updatedUser.updated = Date.now();
            }
            if (!users[0].profiles[profile.provider] || !deepEqual(users[0].profiles[profile.provider], tempUser.profiles[profile.provider], { strict: true })) {
                updatedUser.profiles = { };
                updatedUser.profiles[profile.provider] = tempUser.profiles[profile.provider];
                updatedUser.updated = Date.now();
            }
            user = !updatedUser.updated ? users[0] : await (<UserRepository>this).findOneAndUpdate({ _id: users[0]._id }, updatedUser);
            if (updatedUser.updated) {
                console.log(`Updated ${profile.provider} user profile`, user);
            }
        } else {
            // Create new user
            tempUser.code = profile.id;
            tempUser.updated = undefined;
            user = await (<UserRepository>this).save(tempUser);
            console.log(`Created new ${profile.provider} user profile`, user);
        }

        return Promise.resolve(user);
    }
}