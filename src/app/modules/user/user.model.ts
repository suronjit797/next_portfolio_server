import { Schema, model } from "mongoose";
import { TUser, TUserModel } from "./user.interface";
import { userRole } from "../../../constants/userConstants";
import { ImageSchema } from "../../../shared/globalConstant";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(userRole), default: "user" },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    avatar: ImageSchema,
  },
  { timestamps: true }
);

const UserModel = model<TUser, TUserModel>("User", userSchema);

export default UserModel;
