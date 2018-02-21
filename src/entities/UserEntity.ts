import * as mongoose from "mongoose";
import { DbEntity, DbSchema, LocationView, AttachmentView, LocationSchema, AttachmentSchema } from "@gtm/lib.service"

export interface ProfileView {
    /** Google/FB profile id*/
    code: string;

    /** Google/FB display name, ex: Thanh Pham */
    name: string;

    /** OAuth2 provider: google/facebook/builtin/.. */
    provider: string;

    /** Link to [role] table */
    roles?: UserRole[];

    /** [true] - active user
     * [false] - inactive user
     * [<null>] - is un-approved user state with limited access to the system, this state is auto created by OAuth2 process */
    active?: boolean;

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

export interface UserEntity extends DbEntity, UserView {
}

export const UserRoleSchema =  {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
}

export const UserSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required: true },
    provider: { type: mongoose.Schema.Types.String, required: true },
    profiles: { type: mongoose.Schema.Types.Mixed, required: true },
    roles: { type: [UserRoleSchema], required: false },
    active: { type: mongoose.Schema.Types.Boolean, required: false },

    birthday: { type: mongoose.Schema.Types.Number, required: false },
    address: { type: mongoose.Schema.Types.String, required: false },
    location: { type: LocationSchema, required: false },
    phone: { type: mongoose.Schema.Types.String, required: false },
    email: { type: mongoose.Schema.Types.String, required: false },
    language: { type: mongoose.Schema.Types.String, required: false },
    gender: { type: mongoose.Schema.Types.String, required: false },
    timezone: { type: mongoose.Schema.Types.Number, required: false },
    avatar: { type: AttachmentSchema, required: false },
};

export module User {
    export function toProfileView(entity: UserEntity): ProfileView {
        const { _id, __v, created, deleted, updated, profiles, avatar, ...view } = !!(<mongoose.Document><any>entity).toObject ? (<mongoose.Document><any>entity).toObject() : entity;
        return view;
    }
}