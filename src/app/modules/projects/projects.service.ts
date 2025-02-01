import globalService from "../../global/global.service";
import ProjectModel from "./projects.model";

// global
const globalServices = globalService(ProjectModel);

const projectServices = { ...globalServices };

export default projectServices;
