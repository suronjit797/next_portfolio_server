import gql from "graphql-tag";

export const globalTypeDefs = gql`
  scalar Date
  scalar JSON

  enum SortOrder {
    asc
    ascending
    desc
    descending
  }

  #  type
  type MetaQuery {
    page: Int!
    limit: Int!
    total: Int!
  }

  type ImageType {
    uid: String
    name: String
    status: String
    url: String
    size: Int
  }

  # input

  input ImageInput {
    uid: String
    name: String
    status: String
    url: String
    size: Int
  }

  input PaginationInput {
    page: Int
    limit: Int
    sortOrder: SortOrder
    sortBy: String
  }
`;

export const globalResolvers = {
  Query: {},
  Mutation: {},
};
