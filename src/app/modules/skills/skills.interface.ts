import { Model, ObjectId } from "mongoose";
import { IMeta, IPagination } from "../../../shared/globalInterfaces";

export interface ISkills {
  name: string;
  image: string;
  types: string;
}

export type ISkillsModel = Model<ISkills, Record<string, unknown>>;

// gql
export interface SkillsQueryInput extends ISkills {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  search?: string;
  [key: string]: unknown;
}

export interface SkillsPaginationArgs {
  pagination: IPagination;
  query: SkillsQueryInput;
}

export interface GetAllSkills {
  meta: IMeta;
  data: ISkills[] | null;
}
