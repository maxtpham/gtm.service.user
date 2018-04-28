import * as mongoose from "mongoose";
import { DbEntity, DbSchema } from "@gtm/lib.service/bin";


export interface AccountEntity extends DbEntity {
  userId: string;
  balance: number;
  balanceGold: number;
  bonus?: number;
}; 

export const AccountSchema = {
  ...DbSchema,
  userId: { type: mongoose.Schema.Types.String, require: true },
  balance: { type: mongoose.Schema.Types.Number, require: true },
  balanceGold: { type: mongoose.Schema.Types.Number, require: true },  
  bonus: { type: mongoose.Schema.Types.Number, require: false },
};
