import { Schema, Types, model } from "mongoose";
import { IProject, TProjectModel } from "./projects.interface";

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    thumbnail: {
      path: { type: String, require: true },
      size: { type: String || Number, require: true },
      filename: { type: String, require: true },
    },
    images: [
      {
        path: { type: String, require: true },
        size: { type: String || Number, require: true },
        filename: { type: String, require: true },
      },
    ],
    description: { type: String, require: true },
    packages: [{ type: String, require: true }],
    tags: [{ type: String, require: true }],
    liveUrl: { type: String, require: true },
    githubUrl: {
      frontend: { type: String, require: true },
      backend: { type: String, require: true },
    },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const ProjectModel = model<IProject, TProjectModel>("Project", projectSchema);

export default ProjectModel;
