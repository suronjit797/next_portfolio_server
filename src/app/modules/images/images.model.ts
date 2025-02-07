import { Schema, model } from "mongoose";
import { IImageModel } from "./images.interface";
import { ImageSchema } from "../../../shared/globalConstant";
import { ImageInterface } from "../../../shared/globalInterfaces";

const skillsSchema = new Schema<ImageInterface>(ImageSchema, { timestamps: true });

const ImagesModel = model<ImageInterface, IImageModel>("Images", skillsSchema);

export default ImagesModel;
