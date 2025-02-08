import { IPagination, TFilter } from "../../../shared/globalInterfaces";
import globalService from "../../global/global.service";
import MessagesModel from "./messages.model";

const messagesServices = globalService(MessagesModel);

messagesServices.getAll = async (pagination: IPagination, filter: Partial<TFilter>): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await MessagesModel.find(filter).limit(limit).skip(skip).sort(sortCondition);
  const total = await MessagesModel.countDocuments(filter);
  const unread = await MessagesModel.countDocuments({ unread: true });
  return { data, meta: { page, limit, total, unread } };
};

export default messagesServices;
