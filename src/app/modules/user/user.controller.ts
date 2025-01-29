import { RequestHandler } from "express";
import userService from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import config from "../../../config";
import globalController from "../../global/global.controller";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import UserModel from "./user.model";
import { userRole } from "../../../constants/userConstants";

const name = "User";
// global
const globalControllers = globalController(userService, name);

const login: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.login(req.body);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User Login Failed");
    }

    const { accessToken, refreshToken } = data;

    const cookieOptions = {
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "User Login Successfully",
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.update(req.user.userId, req.body);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "User updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req.query, new UserModel(), ["name", "email"]);
    filter.role = { $ne: userRole.superAdmin };
    const { data, meta } = await userService.getAll(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Users fetched successfully",
      meta,
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.getSingle(req.user._id);
    const payload = {
      success: true,
      message: "Profile fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

const userController = { ...globalControllers, login, updateProfile, getAll, getProfile };
export default userController;
