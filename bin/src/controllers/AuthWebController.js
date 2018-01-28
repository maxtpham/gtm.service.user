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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const express = require("express");
const jwt = require("jsonwebtoken");
const AppConfig_1 = require("./../config/AppConfig");
const lib_service_1 = require("@tm/lib.service");
const SessionRepository_1 = require("../repositories/SessionRepository");
const AuthService_1 = require("../services/AuthService");
let AuthWebController = class AuthWebController extends lib_service_1.WebController {
    /**
     * Check loggedin status
     */
    postSession(req, res, next) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json((req.cookies && req.user && req.user.session) ? Object.assign({}, req.user, { _jwt: req.cookies.jwt }) : undefined);
    }
    /**
     * Web public the book link to user in form: https://www.mybestbook.net//web/auth/to?uri=mybestbook.net://smarttime/st1.workbook?param=value&token={TOKEN}
     * Then the request will generate new token then redirect user to mybestbook.net://smarttime/st1.workbook?param=value&token={TOKEN}
     * {TOKEN} = jwtSign({sessionid})
     */
    buildTokenUrl(req, res, next, cb) {
        if ((req.cookies && req.user && req.user.session)) {
            if (!!req.query.uri) {
                const uri = decodeURIComponent(req.query.uri);
                if (uri.indexOf('{TOKEN}') >= 0) {
                    try {
                        const token = jwt.sign({ id: req.user.session }, AppConfig_1.default.jwt.secret, { expiresIn: 5000 });
                        //console.log('##########################################################', uri.replace('{TOKEN}', token));
                        //res.redirect(302, 'mybestbook.net://' + uri.replace('{TOKEN}', token));
                        cb(res, (uri.indexOf('://') >= 0 ? '' : 'mybestbook.net://') + uri.replace('{TOKEN}', token));
                    }
                    catch (e) {
                        next(e);
                    }
                }
                else {
                    res.status(404).send('Not found');
                }
            }
            else {
                res.status(404).send('Not found');
            }
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
    getTo(req, res, next) {
        this.buildTokenUrl(req, res, next, (res, tokenUrl) => {
            res.redirect(302, tokenUrl);
        });
    }
    postTo(req, res, next) {
        res.setHeader("Access-Control-Allow-Credentials", "true");
        this.buildTokenUrl(req, res, next, (res, tokenUrl) => {
            res.send(tokenUrl);
        });
    }
    /** GET /jwt?t={TOKEN} to convert the TOKEN (another encoded of sessionId) from the /to function above to jwt token for App client to continue to communicate with server under the requesting web user */
    getJwt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!req.query.t) {
                let session;
                try {
                    session = jwt.verify(req.query.t, AppConfig_1.default.jwt.secret);
                }
                catch (err) {
                    console.error('Invalid session', err);
                    res.status(401).send('Unauthorized');
                }
                if (session) {
                    try {
                        const sessionEntity = yield this.SessionRepository.findOneById(session.id);
                        const jwtToken = this.AuthService.toJwtToken(sessionEntity);
                        const cookieValue = jwt.sign(jwtToken, AppConfig_1.default.jwt.secret, { expiresIn: Math.round((jwtToken.expires.getTime() - new Date().getTime()) / 1000) });
                        res.send(cookieValue);
                    }
                    catch (e) {
                        console.error(`Error while building the jwt token from userSession: ${session.id}`, e);
                        next(e);
                    }
                }
            }
            else {
                res.status(404).send('Not found');
            }
        });
    }
};
__decorate([
    inversify_1.inject(SessionRepository_1.SessionRepositoryTYPE),
    __metadata("design:type", Object)
], AuthWebController.prototype, "SessionRepository", void 0);
__decorate([
    inversify_1.inject(AuthService_1.AuthServiceTYPE),
    __metadata("design:type", Object)
], AuthWebController.prototype, "AuthService", void 0);
__decorate([
    inversify_express_utils_1.httpPost('/session'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthWebController.prototype, "postSession", null);
__decorate([
    inversify_express_utils_1.httpGet('/to'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthWebController.prototype, "getTo", null);
__decorate([
    inversify_express_utils_1.httpPost('/to'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], AuthWebController.prototype, "postTo", null);
__decorate([
    inversify_express_utils_1.httpGet('/jwt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AuthWebController.prototype, "getJwt", null);
AuthWebController = __decorate([
    inversify_express_utils_1.controller('/web/auth')
], AuthWebController);
exports.AuthWebController = AuthWebController;
