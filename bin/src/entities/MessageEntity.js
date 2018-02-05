"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@gtm/lib.service");
exports.MessageSchema = Object.assign({}, lib_service_1.DbSchema, { userId: { type: mongoose.Schema.Types.String, required: true }, toUserId: { type: mongoose.Schema.Types.String, required: true }, content: { type: mongoose.Schema.Types.String, required: true }, delivered: { type: mongoose.Schema.Types.Number, required: false } });
