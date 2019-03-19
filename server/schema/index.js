
const appRoot = require('app-root-path')
const config = require('config')
const _ = require('lodash')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')

// [Root Schemas]
const User = require('./User')
const Chat = require('./Chat')
const Message = require('./Message')

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`

// Resolver definitions
const UserResolver = require(appRoot + '/server/resolvers/user.resolver')
const ChatResolver = require(appRoot + '/server/resolvers/chat.resolver')
const MessageResolver = require(appRoot + '/server/resolvers/message.resolver')


const schema = (ctx) => {
  let result = makeExecutableSchema({
    logger: {
      log: (msg) => ctx.logger.warn
    },
    typeDefs: _.flattenDeep([
      SchemaDefinition,
      User,
      Chat,
      Message
    ]),
    resolvers: _.merge(
      UserResolver,
      ChatResolver,
      MessageResolver
    )
  })

  if (config.enableGraphQLMocking) {
    addMockFunctionsToSchema({ schema: result })
  }
  return result
}

module.exports = schema
