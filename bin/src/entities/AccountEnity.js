"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bin_1 = require("@gtm/lib.service/bin");
;
exports.AccountSchema = Object.assign({}, bin_1.DbSchema, { userId: { type: mongoose.Schema.Types.String, require: true }, balance: { type: mongoose.Schema.Types.Number, require: true }, balanceGold: { type: mongoose.Schema.Types.Number, require: true }, bonus: { type: mongoose.Schema.Types.Number, require: false } });
