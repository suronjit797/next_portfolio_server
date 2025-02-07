import gql from "graphql-tag";
import SkillsModel from "./skills.model";
import skillService from "./skills.service";
import { GetAllSkills, SkillsPaginationArgs, ISkills } from "./skills.interface";
import { apolloAuth } from "../../middleware/auth";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import { GraphqlContext, IPagination } from "../../../shared/globalInterfaces";
import { userRole } from "../../../constants/userConstants";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";

const { superAdmin, admin } = userRole;

export const skillsTypeDefs = gql`
  # queries

  type Skills {
    _id: ID!
    name: String!
    image: ImageType!
    types: String!
    createdAt: Date!
    updatedAt: Date!
  }

  # inputs
  input CreateSkillsInput {
    name: String!
    image: ImageInput!
    types: String!
  }

  input UpdateSkillsInput {
    name: String
    image: ImageInput
    types: String
  }

  input SkillsQuery {
    name: String
    types: String
    createdAt: Date
    updatedAt: Date
    search: String
  }

  type getAllSkillsQuery {
    meta: MetaQuery
    data: [Skills!]
  }

  # query
  type Query {
    skills(pagination: PaginationInput, query: SkillsQuery): getAllSkillsQuery!
    skill(id: ID!): Skills
    # getUserSkills(id: ID!, pagination: PaginationInput): getAllSkillsQuery
    # profile: Skills
  }

  # mutation
  type Mutation {
    createSkills(body: CreateSkillsInput!): Skills!
    updateSkill(id: ID!, body: UpdateSkillsInput): Skills!
    deleteSkill(id: ID!): Skills!
    deleteManySkills(query: SkillsQuery!): Skills!
  }
`;

export const skillsResolvers = {
  Query: {
    skills: async (_: undefined, args: SkillsPaginationArgs, context: GraphqlContext): Promise<GetAllSkills> => {
      const { req } = context;
      // Authorization
      await apolloAuth(req);

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new SkillsModel(), ["name", "email"]);

      // Fetch skills
      return await skillService.getAll(page, filter);
    },
    skill: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<ISkills> => {
      const { req } = context;
      // Authorization
      await apolloAuth(req);

      // Fetch skills
      return await skillService.getSingle(args.id);
    },
  },

  Mutation: {
    createSkills: async (
      _: undefined,
      args: { body: Partial<ISkills> },
      context: GraphqlContext
    ): Promise<ISkills | null> => {
      // Authorization
      await apolloAuth(context.req);

      //
      const skills = await skillService.create(args.body);
      return skills;
    },

    updateSkill: async (
      _: undefined,
      args: { id: string; body: Partial<ISkills> },
      { req }: GraphqlContext
    ): Promise<ISkills | null> => {
      // Authorization
      await apolloAuth(req);
      // Update project
      return await skillService.update(args.id, args.body);
    },

    deleteSkill: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<ISkills> => {
      // Authorization
      await apolloAuth(context.req, superAdmin, admin);

      // Delete project
      return await skillService.remove(args.id);
    },

    deleteManySkills: async (
      _: undefined,
      args: { filter: Partial<ISkills> },
      context: GraphqlContext
    ): Promise<ISkills> => {
      const filter = filterHelper(args.filter || {}, new SkillsModel(), [
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
      return await skillService.removeMany(filter);
    },
  },
};
