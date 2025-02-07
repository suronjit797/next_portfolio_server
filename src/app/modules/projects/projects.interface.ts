import { IMeta, IPagination } from "../../../shared/globalInterfaces";
import { Model, ObjectId } from "mongoose";

export interface IProject {
  _id?: string;
  position: number;
  name: string;
  description: string;
  packages: string[];
  tags: string[];
  liveUrl: string;
  thumbnail: { path: string; size: string | number; filename: string };
  images: { path: string; size: string | number; filename: string }[];
  githubUrl: { frontend: string; backend: string };
  user: ObjectId;
}

export type TProjectModel = Model<IProject, Record<string, unknown>>;

// gql
// export interface ProjectQueryInput extends IProject {
//   _id?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   search?: string;
//   [key: string]: unknown;
// }

export interface PaginationArgs {
  pagination: IPagination;
  query: Partial<IProject>;
}

export interface GetAllProjects {
  meta: IMeta;
  data: IProject[] | null;
}
