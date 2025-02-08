import gql from "graphql-tag";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { userRole } from "../../../constants/userConstants";
import filterHelper from "../../../helper/filterHelper";
import { paginationHelper } from "../../../helper/paginationHelper";
import { GraphqlContext } from "../../../shared/globalInterfaces";
import { apolloAuth } from "../../middleware/auth";
import { GetAllMessages, IMessages, MessagesPaginationArgs } from "./messages.interface";
import MessagesModel from "./messages.model";
import messageService from "./messages.service";

const { superAdmin, admin } = userRole;

export const messagesTypeDefs = gql`
  # queries

  type MessagesType {
    _id: ID!
    name: String!
    email: String!
    message: String!
    unread: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  # inputs
  input CreateMessagesInput {
    name: String!
    email: String!
    message: String!
  }

  input UpdateMessagesInput {
    name: String
    email: String
    message: String
    unread: Boolean
  }

  input MessagesQueryInput {
    name: String
    email: String
    message: String
    unread: Boolean
    createdAt: Date
    updatedAt: Date
    search: String
  }

  type MessageMetaQuery {
    page: Int!
    limit: Int!
    total: Int!
    unread: Int!
  }

  type getAllMessagesQuery {
    meta: MessageMetaQuery
    data: [MessagesType!]
  }

  # query
  type Query {
    messages(pagination: PaginationInput, query: MessagesQueryInput): getAllMessagesQuery!
    message(id: ID!): MessagesType
  }

  # mutation
  type Mutation {
    createMessage(body: CreateMessagesInput!): MessagesType!
    updateMessage(id: ID!, body: UpdateMessagesInput): MessagesType!
    deleteMessage(id: ID!): MessagesType!
    deleteManyMessages(query: MessagesQueryInput!): MessagesType!
  }
`;

export const messagesResolvers = {
  Query: {
    messages: async (_: undefined, args: MessagesPaginationArgs, context: GraphqlContext): Promise<GetAllMessages> => {
      const { req } = context;
      // Authorization
      await apolloAuth(req);

      // Pagination and filtering
      const page = paginationHelper(args.pagination);
      const filter = filterHelper(args.query || {}, new MessagesModel(), ["name", "email", "message"]);

      // Fetch messages
      return await messageService.getAll(page, filter);
    },
    message: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<IMessages> => {
      const { req } = context;
      // Authorization
      await apolloAuth(req);

      // Fetch messages
      return await messageService.getSingle(args.id);
    },
  },

  Mutation: {
    createMessage: async (
      _: undefined,
      args: { body: Partial<IMessages> },
      context: GraphqlContext
    ): Promise<IMessages | null> => {
      // Authorization
      await apolloAuth(context.req);

      //
      const messages = await messageService.create(args.body);
      return messages;
    },

    updateMessage: async (
      _: undefined,
      args: { id: string; body: Partial<IMessages> },
      { req }: GraphqlContext
    ): Promise<IMessages | null> => {
      // Authorization
      await apolloAuth(req);
      // Update project
      return await messageService.update(args.id, args.body);
    },

    deleteMessage: async (_: undefined, args: { id: string }, context: GraphqlContext): Promise<IMessages> => {
      // Authorization
      await apolloAuth(context.req, superAdmin, admin);

      // Delete project
      return await messageService.remove(args.id);
    },

    deleteManyMessages: async (
      _: undefined,
      args: { filter: Partial<IMessages> },
      context: GraphqlContext
    ): Promise<IMessages> => {
      const filter = filterHelper(args.filter || {}, new MessagesModel(), [
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
      return await messageService.removeMany(filter);
    },
  },
};
