
'use strict'

const {generateOrderByEnum, fieldsToCondition} = require('./schemaHelper')

const ChatFields = `
  id: ID
  name: String
  users: [String]
`

const ChatInputFields = `
  ${ChatFields}
  createdAt: String
  updatedAt: String
`

const Chat = `

  type Chat {
    ${ChatFields}
  }

  input ChatInput {
    ${ChatInputFields}
  }

  # Order by Enums
  ${generateOrderByEnum('ChatOrderBy', ChatFields)}

  # A condition to be used against \`Chat\` object types. All fields are tested for equality and combined with a logical ‘and.’
  input ChatCondition {
    ${fieldsToCondition(ChatFields)}
  }

  extend type Query {
    # Get chats
    allChats(
      condition: ChatCondition
      orderBy: ChatOrderBy
    ): [Chat]

    # Get a chat by the given id
    chat(id: ID!): Chat
  }

  extend type Mutation {
    # Create or update a Chat
    submitChat(
      values: ChatInput!
    ): Chat!
    # Deletes a Chat
    removeChat(
      # Chat ID
      id: ID!
    ): Int!
  }
`

module.exports = [
  Chat
]