import { UserView, UserRole } from "../entities/UserEntity";
import { RoleType } from "./RoleView";
import { AttachmentView } from "@gtm/lib.service/bin";

export interface MUserView {
  id: string;
  name: string;
  phone: string;
  houseHolder?: any;
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

export interface ScProfileView {
  balance: number;
  bonus: number;

  laiXuatMacDinh?: number;
}

export interface UserViewWithPagination {
  users: UserViewDetails[];
  totalItems: number;
}

export interface UserViewDetails extends UserView {
  id: string;
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
  dob?: number;
  email?: string;
  gender: string;
  status: boolean;
  role: UserRole[];
  address?: string;
  // avatar?: AttachmentView;
}