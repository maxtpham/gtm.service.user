import { UserView } from "../entities/UserEntity";

export interface MUserView {
  id: string;
  name: string;
  phone: string;
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