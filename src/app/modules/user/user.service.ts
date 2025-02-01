import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import config from "../../../config";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import globalService from "../../global/global.service";

// global
const globalServices = globalService(UserModel);

// auth
globalServices.create = async (user: TUser): Promise<TUser | null> => {
  const isExist = await UserModel.findOne({ email: user.email });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const password = await bcrypt.hash(user.password, bcrypt.genSaltSync(config.sault_round));
  const userData = { ...user, password };

  const newUser = await UserModel.create(userData);
  return newUser;
};

const login = async (payload: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  const isExist = await UserModel.findOne({ email: payload.email });
  console.log(isExist, isExist?.isActive);

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Dose not Exist");
  }

  if (!isExist.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Dose not have login permission");
  }

  const match = await bcrypt.compare(payload.password, isExist.password as string);

  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User and password not matched");
  }

  const accessToken = jwt.sign({ userId: isExist._id }, config.token.access_token_secret, {
    expiresIn: config.token.access_token_time,
  });
  const refreshToken = jwt.sign({ userId: isExist._id }, config.token.refresh_token_secret, {
    expiresIn: config.token.refresh_token_time,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const userServices = { ...globalServices, login };

export default userServices;
