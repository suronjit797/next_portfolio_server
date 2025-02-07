import { Model, ObjectId } from "mongoose";
import { ImageInterface, IMeta, IPagination } from "../../../shared/globalInterfaces";

export type IImageModel = Model<ImageInterface, Record<string, unknown>>;

// gql
export interface ImageQueryInput extends ImageInterface {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  search?: string;
  [key: string]: unknown;
}

export interface ImagePaginationArgs {
  pagination: IPagination;
  query: ImageQueryInput;
}

export interface GetAllImage {
  meta: IMeta;
  data: ImageInterface[] | null;
}
