import { UserView, UserRole } from "../entities/UserEntity";
import { RoleType } from "./RoleView";
import { AttachmentView } from "@gtm/lib.service/bin";
import { AccountView } from "./AccountView";

export interface MUserView {
  id: string;
  name: string;
  phone: string;
  email: string;
  houseHolder?: any;
}

export interface MUserFind {
  name: string;
  phone: string;
  email: string;
}


export interface UserViewFull {
  code: string;
  name: string;
  profiles?: any;
  roleCode: string;
  status: number;
}

export interface UserViewLite {
  code: string;
  name: string;
  roleCode: string;
  status: number;
}

export interface UserAccountView {
  balance: number;
  bonus?: number;
}; 

export interface ScProfileView {
  balance: number;
  bonus: number;

  laiXuatMacDinh?: number;
}
export enum UserStatus {
  InActive = 0,
  Active = 1,
  New = 2
}
export interface UserViewWithPagination {
  users: UserViewDetails[];
  totalItems: number;
}

export interface UserViewDetails extends UserView {
  id: string;
  account?: AccountView;
  created: number;
  updated: number;
}

export interface UserRoleView {
  userId: string;
  roleType: RoleType;
}

export interface UserUpdateView {
  name: string;
  phone?: string;
  birthday?: number;
  email?: string;
  gender: string;
  status: UserStatus;
  role: UserRole[];
  address?: string;
  // avatar?: AttachmentView;
}