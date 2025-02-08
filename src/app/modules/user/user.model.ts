import { Schema, model } from "mongoose";
import { TUser, TUserModel } from "./user.interface";
import { ImageSchema } from "../../../shared/globalConstant";


const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin", "superAdmin"], default: "user" },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    avatar: ImageSchema,
  },
  { timestamps: true }
);

const UsersModel = model<TUser, TUserModel>("Users", userSchema);

export default UsersModel;
