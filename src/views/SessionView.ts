import { ProviderSession } from "../oauth2/types";
import { SessionEntity } from "../entities/SessionEntity";
import { UserRole } from "../entities/UserEntity";

export interface SessionView {
    id: string;
    userId: string;

    code: string;

    name: string;

    roles?: string[];

    scope?: string;

    expiresIn?: number;

    /* OAuth2 provider: google, facebook */
    provider?: ProviderSession;
}

export interface SessionViewWithPagination {
    sessions: SessionView[];
    totalItems: number;
}


export module SessionModule {
    export function toSession(
        item: SessionEntity,
        userRoles?: UserRole[]): SessionView {
        let sessionDetail: SessionView = {
            id: item._id,
            userId: item.userId.toHexString(),
            code: item.code,
            name: item.name,
            roles: userRoles ? userRoles.map(r => r.code) : null,
            scope: item.scope,
            expiresIn: item.expiresIn,
            provider: item.provider,
        }
        return sessionDetail;
    }
}