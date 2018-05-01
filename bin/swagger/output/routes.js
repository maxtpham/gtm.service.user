"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const tsoa_1 = require("tsoa");
const index_1 = require("./../index");
const SystemApiController_1 = require("./../../src/controllers/SystemApiController");
const SessionApiController_1 = require("./../../src/controllers/SessionApiController");
const RoleApiController_1 = require("./../../src/controllers/RoleApiController");
const MessageApiController_1 = require("./../../src/controllers/MessageApiController");
const UserApiController_1 = require("./../../src/controllers/UserApiController");
const index_2 = require("./../index");
const models = {
    "MapOfBoolean": {
        "additionalProperties": { "dataType": "boolean" },
    },
    "JwtToken": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "session": { "dataType": "string", "required": true },
            "user": { "dataType": "string", "required": true },
            "roles": { "ref": "MapOfBoolean", "required": true },
            "scope": { "ref": "MapOfBoolean", "required": true },
            "expires": { "dataType": "double", "required": true },
        },
    },
    "ProviderSession": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "access_token": { "dataType": "string", "required": true },
            "refresh_token": { "dataType": "string" },
            "expires_in": { "dataType": "double", "required": true },
            "token_type": { "dataType": "string", "required": true },
        },
    },
    "SessionView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "roles": { "dataType": "array", "array": { "dataType": "string" } },
            "scope": { "dataType": "string" },
            "expiresIn": { "dataType": "double" },
            "provider": { "ref": "ProviderSession" },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
        },
    },
    "SessionViewWithPagination": {
        "properties": {
            "sessions": { "dataType": "array", "array": { "ref": "SessionView" }, "required": true },
            "totalItems": { "dataType": "double", "required": true },
        },
    },
    "RoleStatus": {
        "enums": ["0", "1", "2"],
    },
    "RoleDetailView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string" },
            "status": { "ref": "RoleStatus" },
            "created": { "dataType": "double", "required": true },
            "updated": { "dataType": "double", "required": true },
        },
    },
    "RoleViewWithPagination": {
        "properties": {
            "roles": { "dataType": "array", "array": { "ref": "RoleDetailView" }, "required": true },
            "totalItems": { "dataType": "double", "required": true },
        },
    },
    "RoleView": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string" },
            "status": { "ref": "RoleStatus" },
        },
    },
    "MessageDetailView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "userId": { "dataType": "string", "required": true },
            "userName": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "toUserName": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double", "required": true },
            "announced": { "dataType": "boolean" },
            "created": { "dataType": "double", "required": true },
            "updated": { "dataType": "double", "required": true },
        },
    },
    "MessageViewWithPagination": {
        "properties": {
            "messages": { "dataType": "array", "array": { "ref": "MessageDetailView" }, "required": true },
            "totalItems": { "dataType": "double", "required": true },
        },
    },
    "MessageEntity": {
        "properties": {
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
            "userId": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double" },
            "announced": { "dataType": "boolean" },
        },
    },
    "MessageDetailViewApp": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "userName": { "dataType": "string", "required": true },
            "messageDetailView": { "dataType": "array", "array": { "ref": "MessageDetailView" }, "required": true },
        },
    },
    "MessageViewWithPaginationApp": {
        "properties": {
            "messages": { "dataType": "array", "array": { "ref": "MessageDetailViewApp" }, "required": true },
        },
    },
    "MessageViewWithPaginationAnUserApp": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "userName": { "dataType": "string", "required": true },
            "messages": { "dataType": "array", "array": { "ref": "MessageDetailView" }, "required": true },
        },
    },
    "MessageView": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double" },
            "announced": { "dataType": "boolean" },
        },
    },
    "MUserView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "phone": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "houseHolder": { "dataType": "any" },
        },
    },
    "UserRole": {
        "properties": {
            "id": { "dataType": "any", "required": true },
            "code": { "dataType": "string", "required": true },
        },
    },
    "UserAccount": {
        "properties": {
            "balance": { "dataType": "double" },
            "balanceGold": { "dataType": "double", "required": true },
            "bonus": { "dataType": "double" },
        },
    },
    "UserStatus": {
        "enums": ["0", "1", "2"],
    },
    "LocationView": {
        "properties": {
            "x": { "dataType": "double", "required": true },
            "y": { "dataType": "double", "required": true },
        },
    },
    "ProfileView": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "provider": { "dataType": "string", "required": true },
            "roles": { "dataType": "array", "array": { "ref": "UserRole" } },
            "account": { "ref": "UserAccount" },
            "active": { "dataType": "boolean" },
            "status": { "ref": "UserStatus" },
            "birthday": { "dataType": "double" },
            "address": { "dataType": "string" },
            "location": { "ref": "LocationView" },
            "phone": { "dataType": "string" },
            "email": { "dataType": "string" },
            "language": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "timezone": { "dataType": "double" },
            "isFirstLogin": { "dataType": "boolean" },
        },
    },
    "Binary": {
        "properties": {
            "SUBTYPE_DEFAULT": { "dataType": "double", "required": true },
            "SUBTYPE_FUNCTION": { "dataType": "double", "required": true },
            "SUBTYPE_BYTE_ARRAY": { "dataType": "double", "required": true },
            "SUBTYPE_UUID_OLD": { "dataType": "double", "required": true },
            "SUBTYPE_UUID": { "dataType": "double", "required": true },
            "SUBTYPE_MD5": { "dataType": "double", "required": true },
            "SUBTYPE_USER_DEFINED": { "dataType": "double", "required": true },
            "buffer": { "dataType": "buffer", "required": true },
            "subType": { "dataType": "double" },
        },
    },
    "AttachmentView": {
        "properties": {
            "media": { "dataType": "string", "required": true },
            "data": { "ref": "Binary", "required": true },
        },
    },
    "UserEntity": {
        "properties": {
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
            "code": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "provider": { "dataType": "string", "required": true },
            "roles": { "dataType": "array", "array": { "ref": "UserRole" } },
            "account": { "ref": "UserAccount" },
            "active": { "dataType": "boolean" },
            "status": { "ref": "UserStatus" },
            "birthday": { "dataType": "double" },
            "address": { "dataType": "string" },
            "location": { "ref": "LocationView" },
            "phone": { "dataType": "string" },
            "email": { "dataType": "string" },
            "language": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "timezone": { "dataType": "double" },
            "isFirstLogin": { "dataType": "boolean" },
            "profiles": { "dataType": "any", "required": true },
            "avatar": { "ref": "AttachmentView" },
        },
    },
    "MProfileView": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "gender": { "dataType": "string", "required": true },
            "birthday": { "dataType": "double", "required": true },
            "address": { "dataType": "string", "required": true },
            "localtion": { "ref": "LocationView" },
            "identityCard": { "dataType": "string", "required": true },
            "phone": { "dataType": "string", "required": true },
            "job": { "dataType": "string" },
            "bankRate": { "dataType": "double" },
            "note": { "dataType": "string" },
            "infos": { "dataType": "string" },
            "houseHolder": { "dataType": "string" },
        },
    },
    "MFCMView": {
        "properties": {
            "fcmToken": { "dataType": "string", "required": true },
        },
    },
    "MAvatarView": {
        "properties": {
            "media": { "dataType": "string", "required": true },
            "data": { "dataType": "string", "required": true },
        },
    },
    "AccountView": {
        "properties": {
            "balance": { "dataType": "double" },
            "balanceGold": { "dataType": "double", "required": true },
            "bonus": { "dataType": "double" },
        },
    },
    "UserViewDetails": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "provider": { "dataType": "string", "required": true },
            "roles": { "dataType": "array", "array": { "ref": "UserRole" } },
            "account": { "ref": "AccountView" },
            "active": { "dataType": "boolean" },
            "status": { "ref": "UserStatus" },
            "birthday": { "dataType": "double" },
            "address": { "dataType": "string" },
            "location": { "ref": "LocationView" },
            "phone": { "dataType": "string" },
            "email": { "dataType": "string" },
            "language": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "timezone": { "dataType": "double" },
            "isFirstLogin": { "dataType": "boolean" },
            "profiles": { "dataType": "any", "required": true },
            "avatar": { "ref": "AttachmentView" },
            "id": { "dataType": "string", "required": true },
            "created": { "dataType": "double", "required": true },
            "updated": { "dataType": "double", "required": true },
        },
    },
    "UserViewWithPagination": {
        "properties": {
            "users": { "dataType": "array", "array": { "ref": "UserViewDetails" }, "required": true },
            "totalItems": { "dataType": "double", "required": true },
        },
    },
    "RoleType": {
        "enums": ["1", "2", "3"],
    },
    "UserRoleView": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "roleType": { "ref": "RoleType", "required": true },
        },
    },
    "UserUpdateView": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "phone": { "dataType": "string" },
            "birthday": { "dataType": "double" },
            "email": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "status": { "ref": "UserStatus", "required": true },
            "role": { "dataType": "array", "array": { "ref": "UserRole" }, "required": true },
            "address": { "dataType": "string" },
        },
    },
    "UserAccountView": {
        "properties": {
            "balance": { "dataType": "double" },
            "balanceGold": { "dataType": "double", "required": true },
            "bonus": { "dataType": "double" },
        },
    },
};
function RegisterRoutes(app) {
    app.post('/api/user/v1/system/version', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(SystemApiController_1.SystemApiController);
        const promise = controller.getVersion.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/system/loggedin', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(SystemApiController_1.SystemApiController);
        const promise = controller.getLoggedin.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/session/current', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(SessionApiController_1.SessionApiController);
        const promise = controller.getCurrent.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/session/entities', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userId: { "in": "query", "name": "userId", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(SessionApiController_1.SessionApiController);
        const promise = controller.getEntities.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/role', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            query: { "in": "query", "name": "query", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.getEntities.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/role/get-all', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.getAllEntities.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/role/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.getEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/role', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            roleView: { "in": "body", "name": "roleView", "ref": "RoleView" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.createEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/role/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            roleView: { "in": "body", "name": "roleView", "ref": "RoleView" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.updateEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.delete('/api/user/v1/role/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(RoleApiController_1.RoleApiController);
        const promise = controller.deleteEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            from: { "in": "query", "name": "from", "dataType": "string" },
            to: { "in": "query", "name": "to", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getEntities.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message/getbyid/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message/getforapp', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            from: { "in": "query", "name": "from", "dataType": "string" },
            to: { "in": "query", "name": "to", "dataType": "string" },
            req: { "in": "request", "name": "req", "dataType": "object" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getListMessageForApp.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message/getforanuserapp', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userIdToGetMessage: { "in": "query", "name": "userIdToGetMessage", "required": true, "dataType": "string" },
            from: { "in": "query", "name": "from", "dataType": "string" },
            to: { "in": "query", "name": "to", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            req: { "in": "request", "name": "req", "dataType": "object" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getListMessageOfUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message/get-message-to-notification', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getMessageToNotification.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/Message/get-message-to-notification-update', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.getMessageToNotificationUpdate.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/Message', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            messageView: { "in": "body", "name": "messageView", "required": true, "ref": "MessageView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.createEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.put('/api/user/v1/Message/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            messageView: { "in": "body", "name": "messageView", "required": true, "ref": "MessageView" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.updateEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.delete('/api/user/v1/Message/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(MessageApiController_1.MessageApiController);
        const promise = controller.deleteEntity.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/get-user-lite', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {};
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getUserLite.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/getById/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getById.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/get-by-user-name', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userName: { "in": "query", "name": "userName", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getUserByName.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/get-lender-for-app', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            find: { "in": "query", "name": "find", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getLenderUserForApp.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/find-user', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            find: { "in": "query", "name": "find", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.findUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/profile', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getProfileCurrent.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/profile-for-mobile', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getProfileCurrentForMobile.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/profile', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            profileView: { "in": "body", "name": "profileView", "required": true, "ref": "ProfileView" },
            req: { "in": "request", "name": "req", "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.updateProfileCurrent.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/update-user-profiles', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            profile: { "in": "body", "name": "profile", "required": true, "ref": "MProfileView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.updateUserProfiles.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/set-fcm-for-mobile', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            fcms: { "in": "body", "name": "fcms", "required": true, "ref": "MFCMView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.setFCMForMobile.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/get-fcm-for-mobile', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userId: { "in": "query", "name": "userId", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getFCMForMobile.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/update-avatar', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            avatar: { "in": "body", "name": "avatar", "required": true, "ref": "MAvatarView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.updateAvatar.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/entities', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            status: { "in": "query", "name": "status", "dataType": "string" },
            userId: { "in": "query", "name": "userId", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            sortName: { "in": "query", "name": "sortName", "dataType": "string" },
            sortType: { "in": "query", "name": "sortType", "dataType": "double" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getEntities.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/details/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getDetailViewById.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/create-or-update-role', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userRoleView: { "in": "body", "name": "userRoleView", "required": true, "ref": "UserRoleView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.createOrUpdateUserRole.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/update-user-details/:userId', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            userDetails: { "in": "body", "name": "userDetails", "required": true, "ref": "UserUpdateView" },
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.updateUserDetail.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.get('/api/user/v1/user/get-user-account/:userId', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.getUserAccount.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    app.post('/api/user/v1/user/update-user-account/:userId', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            userAccountView: { "in": "body", "name": "userAccountView", "required": true, "ref": "UserAccountView" },
            type: { "in": "query", "name": "type", "dataType": "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request);
        }
        catch (err) {
            return next(err);
        }
        const controller = index_1.iocContainer.get(UserApiController_1.UserApiController);
        const promise = controller.updateUserAccount.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, next);
    });
    function authenticateMiddleware(security = []) {
        return (request, response, next) => {
            let responded = 0;
            let success = false;
            for (const secMethod of security) {
                index_2.expressAuthentication(request, secMethod.name, secMethod.scopes).then((user) => {
                    // only need to respond once
                    if (!success) {
                        success = true;
                        responded++;
                        request['user'] = user;
                        next();
                    }
                })
                    .catch((error) => {
                    responded++;
                    if (responded == security.length && !success) {
                        response.status(401);
                        next(error);
                    }
                });
            }
        };
    }
    function promiseHandler(controllerObj, promise, response, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode;
            if (controllerObj instanceof tsoa_1.Controller) {
                const controller = controllerObj;
                const headers = controller.getHeaders();
                Object.keys(headers).forEach((name) => {
                    response.set(name, headers[name]);
                });
                statusCode = controller.getStatus();
            }
            if (typeof data !== 'undefined') {
                response.status(statusCode || 200).json(data);
            }
            else {
                response.status(statusCode || 204).end();
            }
        })
            .catch((error) => next(error));
    }
    function getValidatedArgs(args, request) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return tsoa_1.ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return tsoa_1.ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return tsoa_1.ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return tsoa_1.ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return tsoa_1.ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new tsoa_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
}
exports.RegisterRoutes = RegisterRoutes;
