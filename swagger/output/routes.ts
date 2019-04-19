/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../index';
import { AccountApiController } from './../../src/controllers/AccountApiController';
import { SystemApiController } from './../../src/controllers/SystemApiController';
import { SessionApiController } from './../../src/controllers/SessionApiController';
import { RoleApiController } from './../../src/controllers/RoleApiController';
import { UserApiController } from './../../src/controllers/UserApiController';
import { expressAuthentication } from './../index';
import * as express from 'express';

const models: TsoaRoute.Models = {
    "AccountEntity": {
        "properties": {
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
            "userId": { "dataType": "string", "required": true },
            "balance": { "dataType": "double", "required": true },
            "balanceGold": { "dataType": "double", "required": true },
            "bonus": { "dataType": "double" },
        },
    },
    "MAccountView": {
        "properties": {
            "userId": { "dataType": "string", "required": true },
            "balance": { "dataType": "double", "required": true },
            "balanceGold": { "dataType": "double", "required": true },
        },
    },
    "AccountView": {
        "properties": {
            "balance": { "dataType": "double" },
            "balanceGold": { "dataType": "double", "required": true },
            "bonus": { "dataType": "double" },
        },
    },
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
    "ProfileDefault": {
        "properties": {
            "bankRate": { "dataType": "double", "required": true },
            "job": { "dataType": "string", "required": true },
            "infos": { "dataType": "string", "required": true },
            "note": { "dataType": "string", "required": true },
            "identityCard": { "dataType": "string", "required": true },
            "houseHolder": { "dataType": "string", "required": true },
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
            "fcmToken": { "dataType": "string" },
            "profileDefault": { "ref": "ProfileDefault" },
            "isFirstLogin": { "dataType": "boolean" },
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
    "MUserFindByPhone": {
        "properties": {
            "id": { "dataType": "string" },
            "name": { "dataType": "string" },
            "phone": { "dataType": "string" },
            "birthday": { "dataType": "double" },
            "email": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "houseHolder": { "dataType": "any" },
        },
    },
    "StatusFindByPhone": {
        "enums": ["1", "0", "2"],
    },
    "MFindUserByPhone": {
        "properties": {
            "user": { "ref": "MUserFindByPhone", "required": true },
            "status": { "ref": "StatusFindByPhone", "required": true },
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
            "sub_type": { "dataType": "double" },
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
            "fcmToken": { "dataType": "string" },
            "profileDefault": { "ref": "ProfileDefault" },
            "isFirstLogin": { "dataType": "boolean" },
            "profiles": { "dataType": "any", "required": true },
            "avatar": { "ref": "AttachmentView" },
        },
    },
    "MAvatarView": {
        "properties": {
            "media": { "dataType": "string", "required": true },
            "data": { "dataType": "string", "required": true },
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
            "fcmToken": { "dataType": "string" },
            "profileDefault": { "ref": "ProfileDefault" },
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
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
    app.get('/api/user/v1/account/get-all',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAccounts.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/account/get-by-id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "query", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getById.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/account/get-by-user-id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "query", "name": "userId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getByUserId.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/account/my-account',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getMyAccount.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/account/add-balance',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                accountView: { "in": "body", "name": "accountView", "required": true, "ref": "MAccountView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.addBalance.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/account/remove-balance',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                accountView: { "in": "body", "name": "accountView", "required": true, "ref": "MAccountView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.removeBalance.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/account/create',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "query", "name": "userId", "required": true, "dataType": "string" },
                account: { "in": "body", "name": "account", "required": true, "ref": "AccountView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<AccountApiController>(AccountApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.addAccount.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/system/version',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SystemApiController>(SystemApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getVersion.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/system/loggedin',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SystemApiController>(SystemApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getLoggedin.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/session/current',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SessionApiController>(SessionApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getCurrent.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/session/entities',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "query", "name": "userId", "dataType": "string" },
                pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
                itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
                sortName: { "in": "query", "name": "sortName", "dataType": "string" },
                sortType: { "in": "query", "name": "sortType", "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<SessionApiController>(SessionApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getEntities.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/role',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                query: { "in": "query", "name": "query", "dataType": "string" },
                pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
                itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
                sortName: { "in": "query", "name": "sortName", "dataType": "string" },
                sortType: { "in": "query", "name": "sortType", "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getEntities.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/role/get-all',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getAllEntities.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/role/:id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getEntity.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/role',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                roleView: { "in": "body", "name": "roleView", "ref": "RoleView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.createEntity.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/role/:id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                roleView: { "in": "body", "name": "roleView", "ref": "RoleView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateEntity.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/user/v1/role/:id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.deleteEntity.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/profiles/export',
        authenticateMiddleware([{ "jwt": ["admin"] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.exportProfiles.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-user-lite',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getUserLite.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/getById/:id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getById.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-by-user-name',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userName: { "in": "query", "name": "userName", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getUserByName.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-lender-for-app',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                find: { "in": "query", "name": "find", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getLenderUserForApp.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/find-user',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                find: { "in": "query", "name": "find", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.findUser.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/find-user-by-phone',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                find: { "in": "query", "name": "find", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.findUserByPhone.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/profile',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getProfileCurrent.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/profile-for-mobile',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getProfileCurrentForMobile.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/profile',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                profileView: { "in": "body", "name": "profileView", "required": true, "ref": "ProfileView" },
                req: { "in": "request", "name": "req", "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateProfileCurrent.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/update-user-profiles',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                profile: { "in": "body", "name": "profile", "required": true, "ref": "MProfileView" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateUserProfiles.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/set-fcm-for-mobile',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                fcms: { "in": "body", "name": "fcms", "required": true, "ref": "MFCMView" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.setFCMForMobile.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-fcm-for-mobile',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "query", "name": "userId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getFCMForMobile.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/update-avatar',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                avatar: { "in": "body", "name": "avatar", "required": true, "ref": "MAvatarView" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateAvatar.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/entities',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                status: { "in": "query", "name": "status", "dataType": "string" },
                userId: { "in": "query", "name": "userId", "dataType": "string" },
                pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
                itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
                sortName: { "in": "query", "name": "sortName", "dataType": "string" },
                sortType: { "in": "query", "name": "sortType", "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getEntities.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/details/:id',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getDetailViewById.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/create-or-update-role',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userRoleView: { "in": "body", "name": "userRoleView", "required": true, "ref": "UserRoleView" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.createOrUpdateUserRole.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/update-user-details/:userId',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                userDetails: { "in": "body", "name": "userDetails", "required": true, "ref": "UserUpdateView" },
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateUserDetail.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-user-account/:userId',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.getUserAccount.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/update-user-account/:userId',
        authenticateMiddleware([{ "jwt": [] }]),
        function(request: any, response: any, next: any) {
            const args = {
                req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
                userId: { "in": "path", "name": "userId", "required": true, "dataType": "string" },
                userAccountView: { "in": "body", "name": "userAccountView", "required": true, "ref": "UserAccountView" },
                type: { "in": "query", "name": "type", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<UserApiController>(UserApiController);
            if (typeof controller['setStatus'] === 'function') {
                (<any>controller).setStatus(undefined);
            }


            const promise = controller.updateUserAccount.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, _response: any, next: any) => {
            let responded = 0;
            let success = false;

            const succeed = function(user: any) {
                if (!success) {
                    success = true;
                    responded++;
                    request['user'] = user;
                    next();
                }
            }

            const fail = function(error: any) {
                responded++;
                if (responded == security.length && !success) {
                    error.status = 401;
                    next(error)
                }
            }

            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    let promises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        promises.push(expressAuthentication(request, name, secMethod[name]));
                    }

                    Promise.all(promises)
                        .then((users) => { succeed(users[0]); })
                        .catch(fail);
                } else {
                    for (const name in secMethod) {
                        expressAuthentication(request, name, secMethod[name])
                            .then(succeed)
                            .catch(fail);
                    }
                }
            }
        }
    }

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
}
