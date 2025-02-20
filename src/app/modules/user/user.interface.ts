import { ImageInterface, IMeta, IPagination } from "../../../shared/globalInterfaces";
import { Model } from "mongoose";

export type LoginPayload = {
  email: string;
  password: string;
};
export type LoginRes = { accessToken: string; refreshToken: string };
export type TUserModel = Model<TUser, Record<string, unknown>>;

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "user";
  password?: string;
  avatar?: ImageInterface;
  isActive: boolean;
};

export interface IBaseUser {
  name: string;
  email: string;
  role: "superAdmin" | "admin" | "user";
  avatar?: ImageInterface;
}

// gql
export interface UserQueryInput extends IBaseUser {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  search?: string;
  [key: string]: unknown;
}

export interface PaginationArgs {
  pagination: IPagination;
  query: UserQueryInput;
}

export interface CreateUserInput extends IBaseUser {
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GetAllUsers {
  meta: IMeta;
  data: TUser[] | null;
}
