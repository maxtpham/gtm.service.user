"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@gtm/lib.service");
exports.UserSchema = Object.assign({}, lib_service_1.DbSchema, { code: { type: mongoose.Schema.Types.String, required: true }, name: { type: mongoose.Schema.Types.String, required: true }, profiles: { type: mongoose.Schema.Types.Mixed, required: false } });
