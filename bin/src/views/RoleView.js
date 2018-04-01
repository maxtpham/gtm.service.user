"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RoleStatus;
(function (RoleStatus) {
    RoleStatus[RoleStatus["InActive"] = 0] = "InActive";
    RoleStatus[RoleStatus["Active"] = 1] = "Active";
    RoleStatus[RoleStatus["New"] = 2] = "New";
})(RoleStatus = exports.RoleStatus || (exports.RoleStatus = {}));
var RoleType;
(function (RoleType) {
    RoleType[RoleType["Admin"] = 1] = "Admin";
    RoleType[RoleType["Lender"] = 2] = "Lender";
    RoleType[RoleType["Borrower"] = 3] = "Borrower";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
