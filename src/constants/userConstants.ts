import UserModel from "../app/modules/user/user.model";
import userServices from "../app/modules/user/user.service";
import config from "../config";

export const userRole: { [key: string]: string } = {
  superAdmin: "superAdmin",
  admin: "admin",
  user: "user",
};

// create default super admin controller
export const createDefaultSuperAdmin = async () => {
  // check if super admin already exists
  const superAdmin = await UserModel.findOne({ role: userRole.superAdmin });

  if (!superAdmin) {
    return userServices.create({
      name: "Admin",
      role: userRole.superAdmin,
      email: config.SUPER_ADMIN_EMAIL,
      password: config.SUPER_ADMIN_PASSWORD,
    });
  }
  console.log("SUPER_ADMIN: " + superAdmin?.name);
};
