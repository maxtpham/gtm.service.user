import * as mongoose from "mongoose";
import { DbEntity, DbSchema, LocationView, AttachmentView, LocationSchema, AttachmentSchema } from "@gtm/lib.service"
import { UserEntity, UserRole } from "../entities/UserEntity";


export interface MProfileView {

  name: string;
  gender: string;
  birthday: number;
  address: string;
  localtion?: LocationView;
  identityCard: string;
  phone: string;
  job?: string;
  bankRate?: number;
  note?: string;
  infos?: string;
  houseHolder?: string;
  
}

