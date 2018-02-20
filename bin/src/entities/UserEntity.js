"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@gtm/lib.service");
exports.UserRoleSchema = {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    code: { type: mongoose.Schema.Types.String, required: true },
};
exports.UserSchema = Object.assign({}, lib_service_1.DbSchema, { code: { type: mongoose.Schema.Types.String, required: true }, name: { type: mongoose.Schema.Types.String, required: true }, profiles: { type: mongoose.Schema.Types.Mixed, required: true }, roles: { type: [exports.UserRoleSchema], required: false }, active: { type: mongoose.Schema.Types.Boolean, required: false }, birthday: { type: mongoose.Schema.Types.Number, required: false }, address: { type: mongoose.Schema.Types.String, required: false }, location: { type: lib_service_1.LocationSchema, required: false }, phone: { type: mongoose.Schema.Types.String, required: false }, email: { type: mongoose.Schema.Types.String, required: false }, language: { type: mongoose.Schema.Types.String, required: false }, gender: { type: mongoose.Schema.Types.String, required: false }, timezone: { type: mongoose.Schema.Types.Number, required: false }, avatar: { type: lib_service_1.AttachmentSchema, required: false } });
