import { Model } from "mongoose";
import { IMeta, IPagination } from "../../../shared/globalInterfaces";

export interface IMessages {
  name: string;
  email: string;
  message: string;
  unread: boolean
}

export type IMessagesModel = Model<IMessages, Record<string, unknown>>;

// gql
export interface MessagesQueryInput extends IMessages {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  search?: string;
  [key: string]: unknown;
}

export interface MessagesPaginationArgs {
  pagination: IPagination;
  query: MessagesQueryInput;
}

export interface GetAllMessages {
  meta: IMeta;
  data: IMessages[] | null;
}
