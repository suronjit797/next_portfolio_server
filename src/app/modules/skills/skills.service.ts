import SkillsModel from "./skills.model";
import globalService from "../../global/global.service";
import { ISkills } from "./skills.interface";
import { io } from "../../../Scoket";
import { Types } from "mongoose";
import ActiveUserModel from "../activeUser/activeUser.model";
import { SEND_MESSAGE } from "../../../constants/constantsVars";

const skillsServices = globalService(SkillsModel);
skillsServices.create = async (body: ISkills): Promise<Partial<ISkills> | null> => {
  const { users } = body;
  const skills = await (await SkillsModel.create(body)).populate("sender users");
  // realtime io setup
  if (users?.length > 0 && io) {
    const ids = users.map((id) => new Types.ObjectId(id as string));
    const receiverUsers = await ActiveUserModel.find({ userId: ids }).select({ socketId: 1, _id: 0 });
    const receiverIds = receiverUsers.map((r) => r.socketId);


    if (receiverIds.length > 0) io.to(receiverIds).emit(SEND_MESSAGE, skills);
  } else {
    console.log("skills not send");
  }

  return skills;
};

export default skillsServices;
