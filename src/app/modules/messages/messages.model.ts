import { Schema, model } from "mongoose";
import { IMessages, IMessagesModel } from "./messages.interface";
import { ImageSchema } from "../../../shared/globalConstant";

const messagesSchema = new Schema<IMessages>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MessagesModel = model<IMessages, IMessagesModel>("Messages", messagesSchema);

export default MessagesModel;
