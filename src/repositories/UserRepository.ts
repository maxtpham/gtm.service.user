import { Document, SchemaDefinition } from "mongoose";
const deepEqual = require('deep-equal');
import { inject } from "inversify";
import * as passport from "passport";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { UserEntity, UserSchema } from '../entities/UserEntity';
import { MUserView } from "../views/MUserView";
import { Utils, OAuth2ProfileExt } from "@gtm/lib.service.auth";

export interface UserDocument extends UserEntity, Document { }

export const UserRepositoryTYPE = Symbol("UserRepository");

export interface UserRepository extends Repository<UserEntity> {
    /** Get or create User by passport Profile. If User exists, compare and update changes */
    getByProfile(profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<UserEntity>;
    buildClientRole: (user: UserEntity) => MUserView;
}

@injectableSingleton(UserRepositoryTYPE)
export class UserRepositoryImpl extends RepositoryImpl<UserDocument> implements UserRepository {

    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "user", UserSchema);
    }

    public async getByProfile(profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<UserEntity> {
        // Find & update the user by code (profile.id)
        let user: UserEntity;
        let users = await (<UserRepository>this).find({ code: profile.id });
        if (users && users.length > 0 && users[0]._id) {
            // Check to update user (if name or profile is changed)
            let updatedUser: UserEntity = <UserEntity>{ };
            if (users[0].name !== profileExt.name) {
                updatedUser.name = profileExt.name;
                updatedUser.updated = Date.now();
            }
            if (!users[0].profiles[profile.provider] || !deepEqual(users[0].profiles[profile.provider], (<any>profile)._json, { strict: true })) {
                updatedUser.profiles = { [profile.provider]: (<any>profile)._json };
                updatedUser.updated = Date.now();
            }
            user = !updatedUser.updated ? users[0] : await (<UserRepository>this).findOneAndUpdate({ _id: users[0]._id }, updatedUser);
            if (updatedUser.updated) {
                console.log(`Updated ${profile.provider} user profile`, user);
            }
        } else {
            // Create new user
            user = await (<UserRepository>this).save(<UserEntity>{
                code: profileExt.id,
                name: profileExt.name,
                provider: profile.provider,
                profiles: { [profile.provider]: (<any>profile)._json },
                email: profileExt.email,
                gender: profileExt.gender,
                avatar: await Utils.fetchPhoto(profileExt.avatar),
                address: profileExt.address,
                timezone: profileExt.timezone,
                language: profileExt.language,
            });
            console.log(`Created new ${profile.provider} user profile`, user);
        }

        return Promise.resolve(user);
    }

    public buildClientRole(user: UserEntity): MUserView {
        return <MUserView>{
            id: user._id,
            name: user.name,
        }
    }
}