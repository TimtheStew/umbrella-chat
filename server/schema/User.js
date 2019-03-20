
'use strict'

const { gql } = require('apollo-server-express')
const PageInfo = require('./PageInfo')
const {generateOrderByEnum, fieldsToCondition} = require('./schemaHelper')

const UserInputFields = `
  id: ID
  publicKey: String
  gId: String
  firstName: String
  lastName: String
  displayName: String
  emailAddress: String
  imageUrl: String
  accessToken: String
`

const UserFields = `
  ${UserInputFields}
  createdAt: String
  updatedAt: String
`

const User = gql`
  type User {
    ${UserFields}
  }

  input UserInput {
    ${UserInputFields}
  }

  # Order by Enums
  ${generateOrderByEnum('UserOrderBy', UserFields)}

  # A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
  input UserCondition {
    ${fieldsToCondition(UserFields)}
  }

  type Query {
    # Get users
    allUsers(
      condition: UserCondition
      orderBy: UserOrderBy
    ): [User]

    # Get a user by the given id
    user(id: ID!): User
  }

  type Mutation {
    # Create or update a User
    submitUser(
      values: UserInput!
    ): User!
    # Deletes a User
    removeUser(
      # User ID
      id: ID!
    ): Int!
  }
`

module.exports = [
  User,
  PageInfo
]