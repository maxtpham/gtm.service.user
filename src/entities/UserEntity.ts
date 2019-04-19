import * as mongoose from "mongoose";
import { DbEntity, DbSchema, LocationView, AttachmentView, LocationSchema, AttachmentSchema } from "@gtm/lib.service"
import { UserViewDetails, UserStatus, UserAccountView } from "../views/MUserView";
import { AccountView } from "../views/AccountView";
import { toDateReadable } from "../common/utility";

export interface ProfileView {
    /** Google/FB profile id*/
    code: string;

    /** Google/FB display name, ex: Thanh Pham */
    name: string;

    /** OAuth2 provider: google/facebook/builtin/.. */
    provider: string;

    /** Link to [role] table */
    roles?: UserRole[];

    /** user account */
    account?: UserAccount;

    /** [true] - active user
     * [false] - inactive user
     * [<null>] - is un-approved user state with limited access to the system, this state is auto created by OAuth2 process */
    active?: boolean;

    status?: UserStatus;
    /** UTC tick only date without time component */
    birthday?: number;

    address?: string;
    location?: LocationView;
    phone?: string;
    email?: string;
    /** en, vn,.. */
    language?: string;
    /** male/female */
    gender?: string;
    /** +/- UTC time */
    timezone?: number;

    /** token FCM */
    fcmToken?: string;

    /** profile.default */
    profileDefault?: ProfileDefault; 

    /** First Login */
    isFirstLogin?: boolean;

}

export interface UserView extends ProfileView {
    /** With 3 sub-dcouments:
     * - user.profiles.google: Google profile (auto created by OAuth2 by Google)
     * - user.profiles.facebook: FaceBook profile (auto created by OAuth2 by Google)
     * - user.profiles.app: is an application specific profile, need to define a view: ScProfileView { balance: number; bonus: number; LaiXuatMacDinh: number; .. }
     **/
    profiles: any;

    /** The OAuth2 authentication process should auto
     * load up the default user avatar at 1st user login  */
    avatar?: AttachmentView;

}

export interface UserRole {
    id: any;
    code: string;
}

export interface UserAccount {
    balance?: number;
    balanceGold: number;
    bonus?: number;
}

export interface ProfileDefault {
    bankRate: number,
    job: string,
    infos: string,
    note: string,
    identityCard: string,
    houseHolder: string
}

export interface UserEntity extends DbEntity, UserView {
}

export const UserRoleSchema = {
    id: { type: mongoose.Schema.Types.String, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
    _id: false
}

export const UserSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required: true },
    provider: { type: mongoose.Schema.Types.String, required: true },
    profiles: { type: mongoose.Schema.Types.Mixed, required: true },
    roles: { type: [UserRoleSchema], required: false },
    account: { type: mongoose.Schema.Types.Mixed, required: false },
    active: { type: mongoose.Schema.Types.Boolean, required: false },
    status: { type: mongoose.Schema.Types.Number, required: false },
    birthday: { type: mongoose.Schema.Types.Number, required: false },
    address: { type: mongoose.Schema.Types.String, required: false },
    location: { type: LocationSchema, required: false },
    phone: { type: mongoose.Schema.Types.String, required: false },
    email: { type: mongoose.Schema.Types.String, required: false },
    language: { type: mongoose.Schema.Types.String, required: false },
    gender: { type: mongoose.Schema.Types.String, required: false },
    timezone: { type: mongoose.Schema.Types.Number, required: false },
    avatar: { type: AttachmentSchema, required: false },
    isFirstLogin: { type: mongoose.Schema.Types.Boolean, required: false },
    fcmToken: { type: mongoose.Schema.Types.String, required: false },
    profileDefault: { type: mongoose.Schema.Types.Mixed, required: false }
};

export module User {
    export function toProfileView(entity: UserEntity): ProfileView {
        const { _id, __v, created, deleted, updated, profiles, avatar, ...view } = !!(<mongoose.Document><any>entity).toObject ? (<mongoose.Document><any>entity).toObject() : entity;
        return view;
    }
    export function toExportableProfile(entity: UserEntity): ProfileView {
        const { _id, __v, deleted, profiles, avatar, account, isFirstLogin, profileDefault, roles, location, fcmToken, ...view } = !!(<mongoose.Document><any>entity).toObject ? (<mongoose.Document><any>entity).toObject() : entity;
        view.id = entity._id;
        view.created = toDateReadable(view.created) as any;
        view.updated = toDateReadable(view.updated) as any;
        view.birthday = toDateReadable(view.birthday) as any;
        if (typeof(view.active) !== 'boolean') view.active = '';
        if (typeof(view.address) !== 'string') view.address = '';
        if (typeof(view.gender) !== 'string') view.gender = '';
        if (typeof(view.phone) !== 'string') view.phone = '';
        if (typeof(view.timezone) !== 'number') view.timezone = '';
        if (typeof(view.language) !== 'string') view.language = '';
        if (typeof(view.email) !== 'string') view.email = '';
        if (typeof(view.status) !== 'number') view.status = ''; else {
            switch (view.status) {
                case UserStatus.InActive: view.status = 'inactive'; break;
                case UserStatus.Active: view.status = 'active'; break;
                case UserStatus.New: view.status = 'new'; break;
            }
        }
        return view;
    }
    export function toProfileViewForMobile(entity: UserEntity): ProfileView {
        const { _id, __v, created, deleted, profiles, updated, avatar, ...view } = !!(<mongoose.Document><any>entity).toObject ? (<mongoose.Document><any>entity).toObject() : entity;
        delete profiles.google;
        delete profiles.facebook;
        return {...view, ...profiles };
    }
    export function toProfileViews(entity: UserEntity[]): ProfileView[] {
        let profilesList: ProfileView[] = [];
        entity.forEach((item) => {
            let profiles: ProfileView = {
                name: item.name,
                code: item.code,
                provider: item.profiles,
                roles: item.roles,
                active: item.active,
                status: item.status,
                birthday: item.birthday,
                profileDefault: item.profileDefault,
                address: item.address,
                location: item.location,
                phone: item.phone,
                email: item.email,
                language: item.email,
                gender: item.gender,
                timezone: item.timezone,
            };
            profilesList.push(profiles);
        });
        return profilesList;
    }

    export function toDetailViews(item: UserEntity): UserViewDetails {
        let userDetails: UserViewDetails = {
            id: item._id,
            name: item.name,
            code: item.code,
            phone: item.phone,
            email: item.email,
            active: item.active,
            status: item.status,
            provider: item.provider,
            profiles: item.profiles,
            profileDefault: item.profileDefault,
            address: item.address,
            location: item.location,
            language: item.language,
            gender: item.gender,
            roles: item.roles,
            account: item.account,
            birthday: item.birthday,
            timezone: item.timezone,
            avatar: item.avatar,
            created: item.created,
            updated: item.updated,
        };
        return userDetails;
    }

    export function toUserAccountView(entity: UserEntity): UserAccountView {
        return <UserAccountView>{
            balance: entity.account.balance,
            balanceGold: entity.account.balanceGold,
            bonus: entity.account.bonus
        }
    }
}