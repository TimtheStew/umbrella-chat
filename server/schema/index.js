
const config = require('config')
const _ = require('lodash')
const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')

// [Root Schemas]
// const Example = require('./Example')

// const SchemaDefinition = `
//   schema {
//     query: Query
//     mutation: Mutation
//   }
// `

//
// Resolver definitions
//
// const ExampleResolver = require(appRoot + '/server/resolver/example.resolver')

const schema = (ctx) => {
  let result = makeExecutableSchema({
    logger: {
      log: (msg) => ctx.logger.warn
    },
    typeDefs: _.flattenDeep([
      // Example
    ]),
    resolvers: _.merge(
      // ExampleResolver
    )
  })

  if (config.enableGraphQLMocking) {
    addMockFunctionsToSchema({ schema: result })
  }
  return result
}

module.exports = schema
