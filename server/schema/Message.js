'use strict'

const { gql } = require('apollo-server-express')
const User = require('./User')
const {generateOrderByEnum, fieldsToCondition} = require('./schemaHelper')

const MessageFields = `
  id: ID
  body: [String]
  author: User
  chatId: String
`

const Message = gql`
  type Message {
    ${MessageFields}
  }

  # Contains Message and Page meta DataType
  type MessagePage {
    results: [Message]
    pageInfo: PageInfo
  }
    
  # Order by Enums
  ${generateOrderByEnum('MessageOrderBy', MessageFields)}
  extend type Query {
    # Get a Message by the given ID
    message(id: ID!): Message

    allMessages (
      condition: MessageCondition
      orderBy: MessageOrderBy
      pageSize: Int
      pageNumber: Int
    ): MessagePage
  }
  # A condition to be used against \`Message\` object types. All fields are tested for equality and combined with a logical ‘and.’
  input MessageCondition {
    ${fieldsToCondition(MessageFields.replace(/User/g, 'UserInput'))}
  }
  # Message Input
  input MessageInput {
    ${MessageFields.replace(/User/g, 'UserInput')}
  }
  extend type Mutation {
    # Submit a new Message
    submitMessage(
      values: MessageInput!
    ): Message!
    # Delete the given message
    removeMessage(
      id: ID!
    ): Int!
  }
`

module.exports = [
  Message,
  User
]
