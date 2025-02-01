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
    path: String!
    size: Int!
    filename: String!
  }


  # input

  input ImageInput {
    path: String!
    size:  Int!
    filename: String!
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
