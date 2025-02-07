import globalService from "../../global/global.service";
import { IProject } from "./projects.interface";
import ProjectModel from "./projects.model";

// global
const globalServices = globalService(ProjectModel);

const projectServices = { ...globalServices };

projectServices.create = async (body: IProject): Promise<IProject | null> => {
  try {
    const { position, ...rest } = body;

    // Find the last position
    const lastProject = await ProjectModel.findOne().sort({ position: -1 });
    const newPosition = (lastProject?.position || 0) + 1;

    if (position) {
      // Check if position exists
      const existingProject = await ProjectModel.findOne({ position });
      if (existingProject) {
        // Swap the existing project's position with newPosition
        existingProject.position = newPosition;
        await existingProject.save();
      }
    }

    // Create the new project
    const projectData = {
      ...rest,
      position: position || newPosition,
    };

    return await ProjectModel.create(projectData);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

projectServices.update = async (id: string, payload: Partial<IProject>): Promise<IProject | null> => {
  try {
    const { position, ...rest } = payload;

    // Find the project to be updated
    const projectToUpdate = await ProjectModel.findById(id);
    if (!projectToUpdate) {
      throw new Error("project not found");
    }

    const currentPosition = projectToUpdate.position;

    if (position && position !== currentPosition) {
      // Check if the new position exists
      const existingProject = await ProjectModel.findOne({ position });
      if (existingProject) {
        // Temporarily update the existing project's position to avoid conflict
        await ProjectModel.updateOne({ _id: existingProject._id }, { position: currentPosition });
      }
    }

    // Update the project
    projectToUpdate.set({ ...rest, position: position || currentPosition });
    return await projectToUpdate.save();
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export default projectServices;
