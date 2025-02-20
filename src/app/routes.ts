import express from "express";
// import userRouter from "./modules/user/user.routes";

import { auth } from "./middleware/auth";
import { uploadCloudinary } from "./middleware/uploadToCloudinary";
import imagesServices from "./modules/images/images.service";

const router = express.Router();

// const moduleRoute = [
//   // { path: "/users", routes: userRouter, auth: false },
//   // { path: "/transactions", routes: transactionRouter, auth: true },
//   // { path: "/todo", routes: todoRouter, auth: true },
// ];

// moduleRoute.forEach((route) =>
//   route?.auth ? router.use(route.path, auth(), route.routes) : router.use(route.path, route.routes)
// );

// upload
// router.post("/upload", auth(), upload.single("photo"), (req, res, next) => {
router.post("/upload", uploadCloudinary.single("photo"), (req, res, next) => {
  try {
    const data = {
      uid: req.file?.filename,
      name: req.file?.filename.split("/").pop() + ".webp",
      url: req.file?.path,
      size: req.file?.size,
    };
    imagesServices.create(data);
    res.send({
      success: true,
      message: "File uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});


export default router;
