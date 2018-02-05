"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const tsoa_1 = require("tsoa");
const index_1 = require("./../index");
const SystemApiController_1 = require("./../../src/controllers/SystemApiController");
const SessionApiController_1 = require("./../../src/controllers/SessionApiController");
const RoleApiController_1 = require("./../../src/controllers/RoleApiController");
const MessageApiController_1 = require("./../../src/controllers/MessageApiController");
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
            "scope": { "ref": "MapOfBoolean", "required": true },
            "expires": { "dataType": "double", "required": true },
        },
    },
    "RoleDetailView": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string", "required": true },
            "id": { "dataType": "string", "required": true },
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
    "RoleEntity": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "scope": { "dataType": "string" },
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
        },
    },
    "RoleView": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string", "required": true },
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
            "userId": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double" },
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
        },
    },
    "MessageView": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double" },
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
    app.get('/api/user/v1/role', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            query: { "in": "query", "name": "query", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
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
            roleView: { "in": "body", "name": "roleView", "required": true, "ref": "RoleView" },
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
    app.put('/api/user/v1/role/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            roleView: { "in": "body", "name": "roleView", "required": true, "ref": "RoleView" },
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
            query: { "in": "query", "name": "query", "dataType": "string" },
            pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
            itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
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
    app.get('/api/user/v1/Message/:id', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
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
    app.post('/api/user/v1/Message', authenticateMiddleware([{ "name": "jwt" }]), function (request, response, next) {
        const args = {
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
