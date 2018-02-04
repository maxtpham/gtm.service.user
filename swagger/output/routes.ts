/* tslint:disable */
import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { iocContainer } from './../index';
import { SystemApiController } from './../../src/controllers/SystemApiController';
import { SessionApiController } from './../../src/controllers/SessionApiController';
import { RoleApiController } from './../../src/controllers/RoleApiController';
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
            "scope": { "ref": "MapOfBoolean", "required": true },
            "expires": { "dataType": "double", "required": true },
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
    "RoleViewWithPagination": {
        "properties": {
            "roles": { "dataType": "array", "array": { "ref": "RoleEntity" }, "required": true },
            "totalItems": { "dataType": "double", "required": true },
        },
    },
    "RoleView": {
        "properties": {
            "code": { "dataType": "string", "required": true },
            "scope": { "dataType": "string", "required": true },
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
                roleView: { "in": "body", "name": "roleView", "required": true, "ref": "RoleView" },
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
                roleView: { "in": "body", "name": "roleView", "required": true, "ref": "RoleView" },
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