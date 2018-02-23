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
const lib_service_1 = require("@gtm/lib.service");
const tsoa_2 = require("tsoa");
const MessageRepository_1 = require("../repositories/MessageRepository");
const UserRepository_1 = require("../repositories/UserRepository");
let MessageApiController = MessageApiController_1 = class MessageApiController extends lib_service_1.ApiController {
    /** Get Messages */
    getEntities(query, pageNumber, itemCount, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            let queryToEntities = this.MessageRepository.buildQuery(query, from, to);
            let messages = yield this.MessageRepository.findPagination(queryToEntities, pageNumber || 1, itemCount || 5);
            if (messages) {
                let messageTotalItems = yield this.MessageRepository.find(queryToEntities);
                let users = yield this.UserRepository.find({ deleted: null });
                let messageDetailView = [];
                messages.map(mes => {
                    let user = users.find(u => u._id == mes.userId);
                    let toUser = users.find(u => u._id == mes.toUserId);
                    messageDetailView.push({
                        id: mes._id,
                        userId: mes.userId,
                        userName: user ? user.name : '',
                        toUserId: mes.toUserId,
                        toUserName: toUser ? toUser.name : '',
                        content: mes.content,
                        delivered: mes.delivered,
                        created: mes.created,
                        updated: mes.updated
                    });
                });
                let messageDetailViews = { messages: messageDetailView, totalItems: messageTotalItems.length };
                return Promise.resolve(messageDetailViews);
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Get Message by Id */
    getEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let Message = yield this.MessageRepository.findOneById(id);
            if (Message) {
                return Promise.resolve(Message);
            }
            return Promise.reject(`Not found.`);
        });
    }
    /** Create New Message */
    createEntity(messageView) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield this.MessageRepository.save({ userId: messageView.userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered });
            if (message) {
                return Promise.resolve(yield this.MessageRepository.findOneById(message._id));
            }
            if (message instanceof Error) {
                return Promise.reject('Error');
            }
        });
    }
    /** Update Message */
    updateEntity(id, messageView) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield this.MessageRepository.findOneAndUpdate({ _id: id }, { userId: messageView.userId, toUserId: messageView.toUserId, content: messageView.content, delivered: messageView.delivered });
            if (message) {
                return Promise.resolve(yield this.MessageRepository.findOneById(message._id));
            }
            if (message instanceof Error) {
                return Promise.reject('Error');
            }
        });
    }
    /** Delete Message */
    deleteEntity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield this.MessageRepository.findOneAndUpdate({ _id: id }, { s: Date.now() });
            if (message) {
                return Promise.resolve();
            }
            return Promise.reject(`Not found.`);
        });
    }
};
__decorate([
    inversify_1.inject(MessageRepository_1.MessageRepositoryTYPE),
    __metadata("design:type", Object)
], MessageApiController.prototype, "MessageRepository", void 0);
__decorate([
    inversify_1.inject(UserRepository_1.UserRepositoryTYPE),
    __metadata("design:type", Object)
], MessageApiController.prototype, "UserRepository", void 0);
__decorate([
    tsoa_2.Tags('Message'), tsoa_2.Security('jwt'), tsoa_1.Get(),
    __param(0, tsoa_1.Query()), __param(1, tsoa_1.Query()), __param(2, tsoa_1.Query()), __param(3, tsoa_1.Query()), __param(4, tsoa_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MessageApiController.prototype, "getEntities", null);
__decorate([
    tsoa_2.Tags('Message'), tsoa_2.Security('jwt'), tsoa_1.Get('{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageApiController.prototype, "getEntity", null);
__decorate([
    tsoa_2.Tags('Message'), tsoa_2.Security('jwt'), tsoa_1.Post(),
    __param(0, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageApiController.prototype, "createEntity", null);
__decorate([
    tsoa_2.Tags('Message'), tsoa_2.Security('jwt'), tsoa_1.Put('{id}'),
    __param(1, tsoa_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageApiController.prototype, "updateEntity", null);
__decorate([
    tsoa_2.Tags('Message'), tsoa_2.Security('jwt'), tsoa_1.Delete('{id}'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageApiController.prototype, "deleteEntity", null);
MessageApiController = MessageApiController_1 = __decorate([
    lib_common_1.injectableSingleton(MessageApiController_1),
    tsoa_1.Route('api/user/v1/Message')
], MessageApiController);
exports.MessageApiController = MessageApiController;
var MessageApiController_1;
