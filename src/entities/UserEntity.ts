import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service"

export interface UserView {
    /** Google/FB profile id*/
    code: string;

    /** Google/FB display name, ex: Thanh Pham */
    name: string;

    /** With 3 sub-dcouments:
     * - user.profiles.google: Google profile (auto created by OAuth2 by Google)
     * - user.profiles.facebook: FaceBook profile (auto created by OAuth2 by Google)
     * - user.profiles.app: is an application specific profile, need to define a view: ScProfileView { balance: number; bonus: number; LaiXuatMacDinh: number; .. }
     **/
    profiles: any;

    /** Link to [role] table */
    roleId?: mongoose.Types.ObjectId;

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

    /** The OAuth2 authentication process should auto
     * load up the default user avatar at 1st user login  */
    avatar?: AttachmentView;
}

export interface LocationView {
    /** longitude */
    x: number;
    /** latitude */
    y: number;
}

export interface AttachmentView {
    /** HTML Content-Type: image/png, image/jpeg, image/gif,..
     * This will be return to browser client to correctly load & show the image  */
    type: string;

    /** Image raw/binary Content-Data will be stramming to browser client */
    data: Buffer;
}

export interface UserEntity extends DbEntity, UserView {
}

export const LocationSchema = {
    x: { type: mongoose.Schema.Types.Number, required: true },
    y: { type: mongoose.Schema.Types.Number, required: true },
}

export const AttachmentSchema = {
    type: { type: mongoose.Schema.Types.String, required: true },
    data: { type: mongoose.Schema.Types.Buffer, required: true },
}

export const UserSchema = {
    ...DbSchema,
    code: { type: mongoose.Schema.Types.String, required: true },
    name: { type: mongoose.Schema.Types.String, required: true },
    profiles: { type: mongoose.Schema.Types.Mixed, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: false },
    active: { type: mongoose.Schema.Types.Boolean, required: false },

    birthday: { type: mongoose.Schema.Types.Number, required: false },
    address: { type: mongoose.Schema.Types.String, required: false },
    location: { ...LocationSchema, required: false },
    phone: { type: mongoose.Schema.Types.String, required: false },
    email: { type: mongoose.Schema.Types.String, required: false },
    avatar: { ...AttachmentSchema, required: false },
};

export module User {
    export function toView(entity: UserEntity): UserView {
        const { _id, __v, created, deleted, ...view } = !!(<mongoose.Document><any>entity).toObject ? (<mongoose.Document><any>entity).toObject() : entity;
        return view;
    }
}