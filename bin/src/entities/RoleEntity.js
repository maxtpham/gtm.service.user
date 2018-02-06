"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@gtm/lib.service");
exports.RoleSchema = Object.assign({}, lib_service_1.DbSchema, { code: { type: mongoose.Schema.Types.String, required: true }, scope: { type: mongoose.Schema.Types.String, required: false } });
