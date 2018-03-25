"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionModule;
(function (SessionModule) {
    function toSession(item, userRoles) {
        let sessionDetail = {
            id: item._id,
            userId: item.userId.toHexString(),
            code: item.code,
            name: item.name,
            roles: userRoles ? userRoles.map(r => r.code) : null,
            scope: item.scope,
            expiresIn: item.expiresIn,
            provider: item.provider,
        };
        return sessionDetail;
    }
    SessionModule.toSession = toSession;
})(SessionModule = exports.SessionModule || (exports.SessionModule = {}));
