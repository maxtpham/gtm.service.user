import * as mongoose from "mongoose";
import { DbEntity, DbSchema, LocationView, AttachmentView, LocationSchema, AttachmentSchema } from "@gtm/lib.service"
import { UserEntity, UserRole } from "../entities/UserEntity";


export interface MProfileView {

  id: string;

  /** Google/FB display name, ex: Thanh Pham */
  name?: string;

  /** Link to [role] table */
  roles?: UserRole[];

  /** [true] - active user
   * [false] - inactive user
   * [<null>] - is un-approved user state with limited access to the system, this state is auto created by OAuth2 process */
  active?: boolean;

  /** UTC tick only date without time component */
  birthday?: number;

  address?: string;

  location?: LocationView;

  phone?: string;

  email?: string;

  /** en, vn,.. */
  language?: string;

  /** male/female */
  gender?: string;

  /** +/- UTC time */
  timezone?: number;

}

export module UserProfile {
  export function toProfileViews(entity: UserEntity[]): MProfileView[] {
      let profilesList: MProfileView[] = [];
      entity.forEach((item) => {
          let profiles: MProfileView = {
              id: item._id,
              name: item.name,
              roles: item.roles,
              active: item.active,
              birthday: item.birthday,
              address: item.address,
              location: item.location,
              phone: item.phone,
              email: item.email,
              language: item.email,
              gender: item.gender,
              timezone: item.timezone,
          };
          profilesList.push(profiles);
      });
      return profilesList;
  }
  export function toProfileView(item: UserEntity): MProfileView {
    let profiles: MProfileView = {
        id: item._id,
        name: item.name,
        roles: item.roles,
        active: item.active,
        birthday: item.birthday,
        address: item.address,
        location: item.location,
        phone: item.phone,
        email: item.email,
        language: item.email,
        gender: item.gender,
        timezone: item.timezone,
    };
    return profiles;
}
}