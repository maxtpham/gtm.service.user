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
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
};
exports.UserSchema = Object.assign({}, lib_service_1.DbSchema, { code: { type: mongoose.Schema.Types.String, required: true }, name: { type: mongoose.Schema.Types.String, required: true }, provider: { type: mongoose.Schema.Types.String, required: true }, profiles: { type: mongoose.Schema.Types.Mixed, required: true }, roles: { type: [exports.UserRoleSchema], required: false }, active: { type: mongoose.Schema.Types.Boolean, required: false }, birthday: { type: mongoose.Schema.Types.Number, required: false }, address: { type: mongoose.Schema.Types.String, required: false }, location: { type: lib_service_1.LocationSchema, required: false }, phone: { type: mongoose.Schema.Types.String, required: false }, email: { type: mongoose.Schema.Types.String, required: false }, language: { type: mongoose.Schema.Types.String, required: false }, gender: { type: mongoose.Schema.Types.String, required: false }, timezone: { type: mongoose.Schema.Types.Number, required: false }, avatar: { type: lib_service_1.AttachmentSchema, required: false } });
var User;
(function (User) {
    function toProfileView(entity) {
        const _a = !!entity.toObject ? entity.toObject() : entity, { _id, __v, created, deleted, updated, profiles, avatar } = _a, view = __rest(_a, ["_id", "__v", "created", "deleted", "updated", "profiles", "avatar"]);
        return view;
    }
    User.toProfileView = toProfileView;
})(User = exports.User || (exports.User = {}));
