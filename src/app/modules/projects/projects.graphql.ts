import gql from "graphql-tag";
import ProjectModel from "./projects.model";
import projectService from "./projects.service";
import { GetAllProjects, PaginationArgs, IProject } from "./projects.interface";
import { apolloAuth } from "../../middleware/auth";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import { GraphqlContext } from "../../../shared/globalInterfaces";
import { userRole } from "../../../constants/userConstants";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import userServices from "../user/user.service";

const { superAdmin, admin } = userRole;

export const projectTypeDefs = gql`
  # queries
  type GithubUrlType {
    frontend: String
    backend: String
  }

  type Project {
    _id: ID!
    name: String!
    position: Int!
    thumbnail: ImageType!
    images: [ImageType!]!
    description: String!
    packages: [String!]!
    tags: [String!]!
    liveUrl: String
    githubUrl: GithubUrlType
    user: User
    createdAt: Date!
    updatedAt: Date!
  }

  # inputs
  input GithubUrlInput {
    frontend: String!
    backend: String!
  }

  input CreateProjectInput {
    name: String!
    position: Int!
    thumbnail: ImageInput!
    images: [ImageInput!]!
    description: String!
    packages: [String!]!
    tags: [String!]!
    liveUrl: String
    githubUrl: GithubUrlInput!
  }

  input UpdateProjectInput {
    name: String
    position: Int
    thumbnail: ImageInput
    images: [ImageInput]
    description: String
    packages: [String]
    tags: [String!]
    liveUrl: String
    githubUrl: GithubUrlInput
  }

  input ProjectQueryInput {
    _id: ID
    name: String
    position: Int
    packages: [String]
    tags: [String]
    liveUrl: String
    githubUrl: GithubUrlInput
    search: String
  }

  type getAllProjectsQuery {
    meta: MetaQuery
    data: [Project!]
  }

  # query
  type Query {
    projects(pagination: PaginationInput, query: ProjectQueryInput): getAllProjectsQuery!
    project(id: ID!): Project
  }

  # mutation
  type Mutation {
    createProject(body: CreateProjectInput!): Project!
    updateProject(id: ID!, body: UpdateProjectInput): Project!
    deleteProject(id: ID!): Project!
    deleteManyProject(query: ProjectQueryInput!): Project!
  }
`;

export const projectResolvers = {
  Project: { user: async (project: IProject) => await userServices.getSingle(project.user) },
  Query: {
    projects: async (_: undefined, args: PaginationArgs, context: GraphqlContext): Promise<GetAllProjects> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req, admin);

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new ProjectModel(), [
        "name",
        "description",
        "packages",
        "tags",
        "liveUrl",
      ]);

      // Fetch projects
      return await projectService.getAll(page, filter);
    },

    project: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<Partial<IProject> | null> => {
      // Authorization
      await apolloAuth(context.req);

      // Fetch single project
      return await projectService.getSingle(args.id);
    },
  },

  Mutation: {
    createProject: async (
      _: undefined,
      args: { body: IProject },
      context: GraphqlContext
    ): Promise<IProject | null> => {
      // Register project
      await apolloAuth(context.req, superAdmin, admin);
      const body = { ...args.body, user: context.req.user?._id };
      return await projectService.create(body);
    },

    updateProject: async (
      _: undefined,
      args: { id: string; body: Partial<IProject> },
      { req }: GraphqlContext
    ): Promise<IProject | null> => {
      // Authorization
      await apolloAuth(req);
      // Update project
      return await projectService.update(args.id, args.body);
    },

    deleteProject: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<IProject> => {
      // Authorization
      await apolloAuth(context.req, superAdmin, admin);

      // Delete project
      return await projectService.remove(args.id);
    },

    deleteManyProject: async (
      _: undefined,
      args: { filter: Partial<IProject> },
      context: GraphqlContext
    ): Promise<IProject> => {
      const filter = filterHelper(args.filter || {}, new ProjectModel(), [
        "name",
        "description",
        "packages",
        "tags",
        "liveUrl",
      ]);
      // Authorization
      const user = await apolloAuth(context.req, superAdmin, admin);
      if (user.role !== superAdmin && !Object.keys(filter).length) {
        throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Filter is empty");
      }
      // Delete project
      return await projectService.removeMany(filter);
    },
  },
};
