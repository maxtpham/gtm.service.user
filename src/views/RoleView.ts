import { RoleEntity } from "../entities/RoleEntity";

export interface RoleViewWithPagination {
    roles: RoleDetailView[];
    totalItems: number;
}

export interface RoleDetailView {
    id: string;
    code: string;
    scope: string;
    created: number;
    updated: number;
}

export interface RoleView {
    /** role code */
    code: string;

    /** role scope */
    scope: string;
}



export enum RoleType {
    Admin = 1,
    Lender = 2,
    Borrower = 3
}