import gql from "graphql-tag";
import SkillsModel from "./skills.model";
import skillService from "./skills.service";
import { GetAllSkills, SkillsPaginationArgs, ISkills } from "./skills.interface";
import { apolloAuth } from "../../middleware/auth";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import { GraphqlContext, IPagination } from "../../../shared/globalInterfaces";
import * as userService from "../user/user.service";

export const skillsTypeDefs = gql`
  # queries
  type Skills {
    _id: ID!
    name: String!
    image: String!
    types: String!
    createdAt: Date!
    updatedAt: Date!
  }

  # inputs
  input CreateSkillsInput {    
    name: String!
    image: String!
    types: String!
  }



  input SkillsQuery {
    name: String
    image: String
    types: String
    createdAt: String
    updatedAt: String
    search: String
  }

  type getAllSkillsQuery {
    meta: MetaQuery
    data: [Skills!]
  }

  # query
  type Query {
    getSkills(pagination: PaginationInput, query: SkillsQuery): getAllSkillsQuery!
    # getSkills(id: ID!): Skills
    # getUserSkills(id: ID!, pagination: PaginationInput): getAllSkillsQuery
    # profile: Skills
  }

  # mutation
  type Mutation {
    createSkills(body: CreateSkillsInput!): Skills!
    # deleteSkills(id: ID!): Skills!
    # updateSkills(id: ID!, body: UpdateSkillsInput): Skills!
  }
`;

export const skillsResolvers = {
  // Skills: {
  //   users: async (skills: ISkills) => {
  //     // Pagination and filtering
  //     const page = paginationHelper({ limit: 100 });
  //     const filter = { _id: { $in: skills.users } };

  //     // Fetch users
  //     const { data } = await userService.getAll_service(page, filter);
  //     return data;
  //   },
  //   sender: async (skills: ISkills) => await userService.getSingle_service(skills.sender),
  // },
  Query: {
    getSkills: async (_: undefined, args: SkillsPaginationArgs, context: GraphqlContext): Promise<GetAllSkills> => {
      const { req } = context;

      // Authorization
      await apolloAuth(req, "admin");

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new SkillsModel(), ["name", "email"]);

      // Fetch skills
      return await skillService.getAll(page, filter);
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
  
  },
};
