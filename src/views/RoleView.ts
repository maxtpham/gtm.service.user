import { RoleEntity } from "../entities/RoleEntity";

export interface RoleViewWithPagination {
    roles: RoleDetailView[];
    totalItems: number;
}

export interface RoleDetailView {
    id: string;
    code: string;
    scope?: string;
    status?: RoleStatus;
    created: number;
    updated: number;
}

export interface MRoleView {
    id: string;
    code: string;
    status?: RoleStatus;
}

export interface RoleView {
    /** role code */
    code: string;

    /** role scope */
    scope?: string;

    /** role status */
    status?: RoleStatus;
}

export enum RoleStatus {
    InActive = 0,
    Active = 1,
    New = 2,
}

export enum RoleType {
    Admin = 1,
    Lender = 2,
    Borrower = 3
}