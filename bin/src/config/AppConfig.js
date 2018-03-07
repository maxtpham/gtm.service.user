"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c = require("config");
var config = c;
exports.default = config;
if (!config.services) {
    config.services = {};
}
