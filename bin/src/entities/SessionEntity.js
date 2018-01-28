"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const lib_service_1 = require("@tm/lib.service");
exports.SessionSchema = Object.assign({}, lib_service_1.DbSchema, { userId: { type: mongoose.Schema.Types.ObjectId, required: true }, code: { type: mongoose.Schema.Types.String, required: true }, name: { type: mongoose.Schema.Types.String, required: true }, scope: { type: mongoose.Schema.Types.String, required: false }, expiresIn: { type: mongoose.Schema.Types.Number, required: false }, provider: {
        _id: false,
        required: false,
        name: { type: mongoose.Schema.Types.String, required: true },
        access_token: { type: mongoose.Schema.Types.String, required: true },
        refresh_token: { type: mongoose.Schema.Types.String, required: false },
        expires_in: { type: mongoose.Schema.Types.Number, required: false },
        token_type: { type: mongoose.Schema.Types.String, required: true },
    } });
