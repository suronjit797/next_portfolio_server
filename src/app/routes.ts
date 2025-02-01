import express from "express";
// import userRouter from "./modules/user/user.routes";

import { auth } from "./middleware/auth";
import { uploadCloudinary } from "./middleware/uploadToCloudinary";

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
    console.log(req.file);
    res.send({
      success: true,
      message: "File uploaded successfully",
      // data: {
      //   path: req.file?.path,
      //   size: req.file?.size,
      //   filename: req.file?.filename,
      // },
      data: {
        uid: req.file?.filename,
        name: req.file?.filename + ".webp",
        status: "done",
        url: req.file?.path,
        size: req.file?.size,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
