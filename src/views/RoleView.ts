import { RoleEntity } from "../entities/RoleEntity";

export interface RoleViewWithPagination {
    roles: RoleEntity[];
    totalItems: number;
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