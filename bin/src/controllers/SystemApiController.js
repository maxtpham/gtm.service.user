"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_common_1 = require("@gtm/lib.common");
const tsoa_1 = require("tsoa");
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const AppConfig_1 = require("./../config/AppConfig");
const tsoa_2 = require("tsoa");
let SystemApiController = SystemApiController_1 = class SystemApiController extends lib_service_1.ApiController {
    /** Get current system version info */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(AppConfig_1.default._version);
        });
    }
    /** Check loggedin status */
    getLoggedin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(req.user && (!!req.user.session));
        });
    }
};
__decorate([
    tsoa_2.Tags('System'), tsoa_2.Security('jwt'), tsoa_1.Post('version'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SystemApiController.prototype, "getVersion", null);
__decorate([
    tsoa_2.Tags('System'), tsoa_2.Security('jwt'), tsoa_1.Get('loggedin'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemApiController.prototype, "getLoggedin", null);
SystemApiController = SystemApiController_1 = __decorate([
    lib_common_1.injectableSingleton(SystemApiController_1),
    tsoa_1.Route('api/user/v1/system')
], SystemApiController);
exports.SystemApiController = SystemApiController;
var SystemApiController_1;
