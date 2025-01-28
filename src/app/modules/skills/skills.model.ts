import { Schema, model } from "mongoose";
import { ISkills, ISkillsModel } from "./skills.interface";

const skillsSchema = new Schema<ISkills>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    types: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const SkillsModel = model<ISkills, ISkillsModel>("Skills", skillsSchema);

export default SkillsModel;
