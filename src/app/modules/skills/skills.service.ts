import SkillsModel from "./skills.model";
import globalService from "../../global/global.service";
import { ISkills } from "./skills.interface";
import { io } from "../../../Scoket";
import { Types } from "mongoose";
import ActiveUserModel from "../activeUser/activeUser.model";
import { SEND_MESSAGE } from "../../../constants/constantsVars";

const skillsServices = globalService(SkillsModel);


export default skillsServices;
