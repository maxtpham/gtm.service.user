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
  infos: string;

}

export module UserProfile {
//   export function toProfileViews(entity: UserEntity[]): MProfileView[] {
//       let profilesList: MProfileView[] = [];
//       entity.forEach((item) => {
//           let profiles: MProfileView = {
//               id: item._id,
//               name: item.name,
//               birthday: item.birthday,
//               address: item.address,
//               phone: item.phone,
//               gender: item.gender,
//               identityCard: item.default
//           };
//           profilesList.push(profiles);
//       });
//       return profilesList;
//   }
//   export function toProfileView(item: UserEntity): MProfileView {
//     let profiles: MProfileView = {
//         id: item._id,
//         name: item.name,
//         roles: item.roles,
//         active: item.active,
//         birthday: item.birthday,
//         address: item.address,
//         location: item.location,
//         phone: item.phone,
//         email: item.email,
//         language: item.email,
//         gender: item.gender,
//         timezone: item.timezone,
//     };
//     return profiles;
// }
}