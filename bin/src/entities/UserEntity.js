"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@gtm/lib.service");
exports.UserRoleSchema = {
    id: { type: mongoose.Schema.Types.String, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
    _id: false
};
exports.UserSchema = Object.assign({}, lib_service_1.DbSchema, { code: { type: mongoose.Schema.Types.String, required: true }, name: { type: mongoose.Schema.Types.String, required: true }, provider: { type: mongoose.Schema.Types.String, required: true }, profiles: { type: mongoose.Schema.Types.Mixed, required: true }, roles: { type: [exports.UserRoleSchema], required: false }, account: { type: mongoose.Schema.Types.Mixed, required: false }, active: { type: mongoose.Schema.Types.Boolean, required: false }, status: { type: mongoose.Schema.Types.Number, required: false }, birthday: { type: mongoose.Schema.Types.Number, required: false }, address: { type: mongoose.Schema.Types.String, required: false }, location: { type: lib_service_1.LocationSchema, required: false }, phone: { type: mongoose.Schema.Types.String, required: false }, email: { type: mongoose.Schema.Types.String, required: false }, language: { type: mongoose.Schema.Types.String, required: false }, gender: { type: mongoose.Schema.Types.String, required: false }, timezone: { type: mongoose.Schema.Types.Number, required: false }, avatar: { type: lib_service_1.AttachmentSchema, required: false }, isFirstLogin: { type: mongoose.Schema.Types.Boolean, required: false }, test: { type: mongoose.Schema.Types.Boolean, required: false } });
var User;
(function (User) {
    function toProfileView(entity) {
        const _a = !!entity.toObject ? entity.toObject() : entity, { _id, __v, created, deleted, updated, profiles, avatar } = _a, view = __rest(_a, ["_id", "__v", "created", "deleted", "updated", "profiles", "avatar"]);
        return view;
    }
    User.toProfileView = toProfileView;
    function toProfileViewForMobile(entity) {
        const _a = !!entity.toObject ? entity.toObject() : entity, { _id, __v, created, deleted, profiles, updated, avatar } = _a, view = __rest(_a, ["_id", "__v", "created", "deleted", "profiles", "updated", "avatar"]);
        delete profiles.google;
        delete profiles.facebook;
        return Object.assign({}, view, profiles);
    }
    User.toProfileViewForMobile = toProfileViewForMobile;
    function toProfileViews(entity) {
        let profilesList = [];
        entity.forEach((item) => {
            let profiles = {
                name: item.name,
                code: item.code,
                provider: item.profiles,
                roles: item.roles,
                active: item.active,
                status: item.status,
                birthday: item.birthday,
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
    User.toProfileViews = toProfileViews;
    function toDetailViews(item) {
        let userDetails = {
            id: item._id,
            name: item.name,
            code: item.code,
            phone: item.phone,
            email: item.email,
            active: item.active,
            status: item.status,
            provider: item.provider,
            profiles: item.profiles,
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
    User.toDetailViews = toDetailViews;
    function toUserAccountView(entity) {
        return {
            balance: entity.account.balance,
            bonus: entity.account.bonus
        };
    }
    User.toUserAccountView = toUserAccountView;
})(User = exports.User || (exports.User = {}));
