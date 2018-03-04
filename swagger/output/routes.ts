/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../index';
import { SystemApiController } from './../../src/controllers/SystemApiController';
import { SessionApiController } from './../../src/controllers/SessionApiController';
import { RoleApiController } from './../../src/controllers/RoleApiController';
import { MessageApiController } from './../../src/controllers/MessageApiController';
import { UserApiController } from './../../src/controllers/UserApiController';
import { expressAuthentication } from './../index';

const models: TsoaRoute.Models = {
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
    "RoleDetailView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string" },
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
            "_id": { "dataType": "any", "required": true },
            "created": { "dataType": "double" },
            "updated": { "dataType": "double" },
            "deleted": { "dataType": "double" },
            "userId": { "dataType": "string", "required": true },
            "toUserId": { "dataType": "string", "required": true },
            "content": { "dataType": "string", "required": true },
            "delivered": { "dataType": "double" },
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
    "MUserView": {
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "phone": { "dataType": "string", "required": true },
        },
    },
    "UserRole": {
        "properties": {
            "id": { "dataType": "any", "required": true },
            "code": { "dataType": "string", "required": true },
        },
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
            "active": { "dataType": "boolean" },
            "birthday": { "dataType": "double" },
            "address": { "dataType": "string" },
            "location": { "ref": "LocationView" },
            "phone": { "dataType": "string" },
            "email": { "dataType": "string" },
            "language": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "timezone": { "dataType": "double" },
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
            "active": { "dataType": "boolean" },
            "birthday": { "dataType": "double" },
            "address": { "dataType": "string" },
            "location": { "ref": "LocationView" },
            "phone": { "dataType": "string" },
            "email": { "dataType": "string" },
            "language": { "dataType": "string" },
            "gender": { "dataType": "string" },
            "timezone": { "dataType": "double" },
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
};

export function RegisterRoutes(app: any) {
    app.post('/api/user/v1/system/version',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getVersion.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/system/loggedin',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getLoggedin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/session/current',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getCurrent.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/role',
        authenticateMiddleware([{ "name": "jwt" }]),
        function(request: any, response: any, next: any) {
            const args = {
                query: { "in": "query", "name": "query", "dataType": "string" },
                pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
                itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<RoleApiController>(RoleApiController);


            const promise = controller.getEntities.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/role/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/role',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.createEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/user/v1/role/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.updateEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/user/v1/role/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.deleteEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/Message',
        authenticateMiddleware([{ "name": "jwt" }]),
        function(request: any, response: any, next: any) {
            const args = {
                query: { "in": "query", "name": "query", "dataType": "string" },
                pageNumber: { "in": "query", "name": "pageNumber", "dataType": "double" },
                itemCount: { "in": "query", "name": "itemCount", "dataType": "double" },
                from: { "in": "query", "name": "from", "dataType": "string" },
                to: { "in": "query", "name": "to", "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<MessageApiController>(MessageApiController);


            const promise = controller.getEntities.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/Message/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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

            const controller = iocContainer.get<MessageApiController>(MessageApiController);


            const promise = controller.getEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/Message',
        authenticateMiddleware([{ "name": "jwt" }]),
        function(request: any, response: any, next: any) {
            const args = {
                messageView: { "in": "body", "name": "messageView", "required": true, "ref": "MessageView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<MessageApiController>(MessageApiController);


            const promise = controller.createEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/user/v1/Message/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                messageView: { "in": "body", "name": "messageView", "required": true, "ref": "MessageView" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = iocContainer.get<MessageApiController>(MessageApiController);


            const promise = controller.updateEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/user/v1/Message/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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

            const controller = iocContainer.get<MessageApiController>(MessageApiController);


            const promise = controller.deleteEntity.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-user-lite',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getUserLite.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/getById/:id',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/get-by-user-name',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getUserByName.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/user/v1/user/profile',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.getProfileCurrent.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/profile',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.updateProfileCurrent.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/user/v1/user/update-user-profiles',
        authenticateMiddleware([{ "name": "jwt" }]),
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


            const promise = controller.updateUserProfiles.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return (request: any, response: any, next: any) => {
            let responded = 0;
            let success = false;
            for (const secMethod of security) {
                expressAuthentication(request, secMethod.name, secMethod.scopes).then((user: any) => {
                    // only need to respond once
                    if (!success) {
                        success = true;
                        responded++;
                        request['user'] = user;
                        next();
                    }
                })
                    .catch((error: any) => {
                        responded++;
                        if (responded == security.length && !success) {
                            response.status(401);
                            next(error)
                        }
                    })
            }
        }
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (typeof data !== 'undefined') {
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
                    return ValidateParam(args[key], request.query[name], models, name, fieldErrors);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, fieldErrors);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, fieldErrors);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, fieldErrors, name + '.');
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, fieldErrors, 'body.');
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }
} 