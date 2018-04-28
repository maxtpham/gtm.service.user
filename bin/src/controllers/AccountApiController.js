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
const inversify_1 = require("inversify");
const lib_common_1 = require("@gtm/lib.common");
const tsoa_1 = require("tsoa");
const express = require("express");
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const AccountRepository_1 = require("../repositories/AccountRepository");
let AccountApiController = AccountApiController_1 = class AccountApiController extends lib_service_1.ApiController {
    /** get all account */
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let accounts = yield this.AccountRepository.find({});
                if (accounts) {
                    return Promise.resolve(accounts);
                }
                return Promise.reject("Server error");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("Server error");
            }
        });
    }
    /** get account by id */
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.AccountRepository.findOneById(id);
                if (account) {
                    return Promise.resolve(account);
                }
                return Promise.reject("Account not exist");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("Account not exist");
            }
        });
    }
    /** get account by id */
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.AccountRepository.findOne({ userId: userId });
                if (account) {
                    return Promise.resolve(account);
                }
                return Promise.reject("Account not exist");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("Account not exist");
            }
        });
    }
    /** get my-account */
    getMyAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.user.user;
                let account = yield this.AccountRepository.findOne({ userId: userId });
                if (account) {
                    return Promise.resolve(account);
                }
                return Promise.reject("Account not exist");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("User have not account");
            }
        });
    }
    /** add balance of account */
    addBalance(req, accountView) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.AccountRepository.findOne({ userId: accountView.userId });
                if (!account) {
                    return Promise.reject("Account not exist");
                }
                let accountToSave = accountView;
                accountToSave.updated = Date.now();
                accountToSave.balance = account.balance + accountView.balance;
                accountToSave.balanceGold = account.balanceGold + accountView.balanceGold;
                let accountSave = yield this.AccountRepository.findOneAndUpdate({ _id: account._id }, accountToSave);
                if (accountSave) {
                    return Promise.resolve(accountSave);
                }
                return Promise.reject("Add balance fail");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("User have not account");
            }
        });
    }
    /** remove balance of account */
    removeBalance(req, accountView) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.AccountRepository.findOne({ userId: accountView.userId });
                if (!account) {
                    return Promise.reject("Account not exist");
                }
                let accountToSave = accountView;
                if (account.balance <= 0 && account.balanceGold <= 0) {
                    return Promise.reject("Account empty balance");
                }
                if (account.balance < accountView.balance && account.balanceGold < accountView.balanceGold) {
                    return Promise.reject("please check balance again");
                }
                accountToSave.balance = account.balance - accountView.balance;
                accountToSave.balanceGold = account.balanceGold - accountView.balanceGold;
                accountToSave.updated = new Date().getTime();
                let accountSave = yield this.AccountRepository.findOneAndUpdate({ _id: account._id }, accountToSave);
                if (accountSave) {
                    return Promise.resolve(accountSave);
                }
                return Promise.reject("Add balance fail");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("User have not account");
            }
        });
    }
    /** add account */
    addAccount(userId, account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let accountTemp = yield this.AccountRepository.find({ userId: userId });
                if (accountTemp.length > 0) {
                    return Promise.reject("Account is exist");
                }
                let accountToSave = account;
                let accountSave = yield this.AccountRepository.save(accountToSave);
                if (accountSave) {
                    return Promise.resolve(accountSave);
                }
                return Promise.reject("Add fail");
            }
            catch (e) {
                console.log(e);
                return Promise.reject("Add fail");
            }
        });
    }
};
__decorate([
    inversify_1.inject(AccountRepository_1.AccountRepositoryTYPE),
    __metadata("design:type", Object)
], AccountApiController.prototype, "AccountRepository", void 0);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Get('get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "getAccounts", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Get('get-by-id'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "getById", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Get('get-by-user-id'),
    __param(0, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "getByUserId", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Get('my-account'),
    __param(0, tsoa_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "getMyAccount", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Post('add-balance'),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "addBalance", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Post('remove-balance'),
    __param(0, tsoa_1.Request()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "removeBalance", null);
__decorate([
    tsoa_2.Tags('Account'), tsoa_2.Security('jwt'), tsoa_1.Post('create'),
    __param(0, tsoa_1.Query()),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccountApiController.prototype, "addAccount", null);
AccountApiController = AccountApiController_1 = __decorate([
    lib_common_1.injectableSingleton(AccountApiController_1),
    tsoa_1.Route('api/user/v1/account')
], AccountApiController);
exports.AccountApiController = AccountApiController;
var AccountApiController_1;
