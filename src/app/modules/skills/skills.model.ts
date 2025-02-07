import { Schema, model } from "mongoose";
import { ISkills, ISkillsModel } from "./skills.interface";
import { ImageSchema } from "../../../shared/globalConstant";

const skillsSchema = new Schema<ISkills>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    image: ImageSchema,
  },
  { timestamps: true }
);

const SkillsModel = model<ISkills, ISkillsModel>("Skills", skillsSchema);

export default SkillsModel;
