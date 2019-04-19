import { Document, SchemaDefinition } from "mongoose";
const deepEqual = require('deep-equal');
import { inject } from "inversify";
import * as passport from "passport";

import { injectableSingleton } from "@gtm/lib.common";
import { MongoClient } from "@gtm/lib.service";
import { Repository, RepositoryImpl } from "@gtm/lib.service";
import { DefaultMongoClientTYPE } from "@gtm/lib.service";
import { UserEntity, UserSchema, UserRole, UserAccount, ProfileView, User } from '../entities/UserEntity';
import { MUserView, MUserFind, UserStatus } from "../views/MUserView";
import { Utils } from "@gtm/lib.service.auth";
import { OAuth2ProfileExt } from "../oauth2/types";

export interface UserDocument extends UserEntity, Document { }

export const UserRepositoryTYPE = Symbol("UserRepository");

export interface UserRepository extends Repository<UserEntity> {
    exportProfiles(): Promise<ProfileView[]>;
    /** Get or create User by passport Profile. If User exists, compare and update changes */
    getByProfile(profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<UserEntity>;
    buildClientUser: (user: UserEntity) => MUserView;
    buildClientUsers: (users: UserEntity[]) => MUserView[];
    getByName(name: string): Promise<UserEntity[]>;
    findUser(mUserFind: MUserFind): Promise<UserEntity[]>;
    getUserRole(id: string): Promise<UserRole[]>;
    buildQuery: (status?: string, userId?: string) => any;
}

@injectableSingleton(UserRepositoryTYPE)
export class UserRepositoryImpl extends RepositoryImpl<UserDocument> implements UserRepository {

    constructor(@inject(DefaultMongoClientTYPE) mongoclient: MongoClient) {
        super(mongoclient, "user", UserSchema);
    }

    public async exportProfiles(): Promise<ProfileView[]> {
        let users = await (<UserRepository>this).find({});
        return users.map(user => User.toExportableProfile(user));
    }

    public async getByProfile(profile: passport.Profile, profileExt: OAuth2ProfileExt): Promise<UserEntity> {
        // Find & update the user by code (profile.id)
        let user: UserEntity;
        let users = await (<UserRepository>this).find({ code: profile.id });
        if (users && users.length > 0 && users[0]._id) {
            // Check to update user (if name or profile is changed)
            let updatedUser: UserEntity = <UserEntity>{};
            const currentUser = users[0];
            const currentProfile = currentUser.profiles[profile.provider];
            if (currentProfile && deepEqual(currentProfile, (<any>profile)._json, { strict: true })) {
                user = currentUser;
            } else {
                console.log('profileExt.avatar', profileExt.avatar);
                if (currentUser.code !== profileExt.id) updatedUser.code = profileExt.id;
                if (currentUser.name !== profileExt.name && currentUser.name === currentProfile.name) updatedUser.name = profileExt.name;
                if (currentUser.provider !== profile.provider) updatedUser.provider = profile.provider;
                if (currentUser.email !== profileExt.email && currentUser.email === currentProfile.email) updatedUser.email = profileExt.email;
                if (currentUser.gender !== profileExt.gender && currentUser.gender === currentProfile.gender) updatedUser.gender = profileExt.gender;
                if (!currentUser.avatar && profileExt.avatar) updatedUser.avatar = await Utils.fetchPhoto(profileExt.avatar);
                if (currentUser.address !== profileExt.address && currentUser.address === currentProfile.address) updatedUser.address = profileExt.address;
                if (currentUser.timezone !== profileExt.timezone && currentUser.timezone === currentProfile.timezone) updatedUser.timezone = profileExt.timezone;
                if (currentUser.language !== profileExt.language && currentUser.language === currentProfile.language) updatedUser.language = profileExt.language;

                updatedUser.profiles = { [profile.provider]: (<any>profile)._json };
                updatedUser.updated = Date.now();
                user = await (<UserRepository>this).findOneAndUpdate({ _id: currentUser._id }, updatedUser);
                console.log(`Updated ${profile.provider} user profile`, user);
            }
        } else {
            // Create new user
            console.log('profileExt.avatar', profileExt.avatar);
            
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
                account: <UserAccount>{ balance: 0, balanceGold: 0 ,bonus: 0 },
                status: UserStatus.New,
                active: null,
                isFirstLogin: true,
            });
            console.log(`Created new ${profile.provider} user profile`, user);
        }

        return Promise.resolve(user);
    }

    public buildQuery(status?: string, userId?: string) {
        let queryToEntities;
        if (!!status || !!userId) {
            queryToEntities = {
                $and: [
                    {
                        deleted: null
                    }
                ]
            };

            if (!!status) {
                let statusToInt = parseInt(status);
                let statusMap = isNaN(statusToInt) ? 0 : statusToInt;
                queryToEntities.$and.push({ status: status });
            }
            if (!!userId) {
                queryToEntities.$and.push({ _id: userId });
            }

        } else {
            queryToEntities = {
                deleted: null
            }
        }

        return queryToEntities;
    }

    public async getByName(name: string): Promise<UserEntity[]> {
        let users = await (<UserRepository>this).find({ name: RegExp(name) });
        return Promise.resolve(users);
    }

    public async findUser(mUserFind: MUserFind): Promise<UserEntity[]> {
        let users = await (<UserRepository>this).find({
            $or: [
                { name: RegExp(mUserFind.name) },
                { phone: RegExp(mUserFind.phone) },
                { email: RegExp(mUserFind.email) },
            ]
        });
        return Promise.resolve(users);
    }

    public buildClientUser(user: UserEntity): MUserView {

        return <MUserView>{
            id: user._id,
            name: user.name,
            phone: user.phone,
            houseHolder: user.profiles.default ? user.profiles.default.houseHolder : ""
        }
    }

    public buildClientUsers(users: UserEntity[]): MUserView[] {
        let mUsers: MUserView[] = [];
        users.forEach((item) => {
            mUsers.push({
                id: item._id,
                name: item.name,
                phone: item.phone,
                email: item.email
            });
        });
        return mUsers;
    }

    public async getUserRole(id: string): Promise<UserRole[]> {
        let user = await this.findOneById(id);
        if (user) {
            return user.roles;
        }
        throw new Error("User not found");
    }
}