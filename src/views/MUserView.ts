export interface MUserView {
  id: String;
  name: String;
}

export interface UserViewFull {
  code: string;
  name: string;
  profiles?: any;
  roleCode: String;
  status: number;
}

export interface UserViewLite {
  code: string;
  name: string;
  roleCode: String;
  status: number;
}