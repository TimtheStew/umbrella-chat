'use strict'

require('dotenv').config()
const schema = require('./schema/index.js')  
const config = require('config')
const shortid = require('shortid')
const express = require('express')
const morgan = require('morgan')
const { verifyAuthHeader } = require('./lib/token')

const app = express()

let ctx = require('./rootCtx')
ctx = ctx.child({ DataLayer: require('./datamodel/models') })

// assign request id
app.use((req, res, next) => {
  let requestId = shortid.generate()
  let requestContext = ctx.child({ reqId: requestId }, true)
  req.context = requestContext
  res.header('x-request-id', requestId)
  if (req.path !== '/healthz') {
    requestContext.logger.info('Assigned request id')
  }
  next()
})

morgan.token('reqId', (req) => req.context.reqId)
app.use(morgan(':method :url :status :reqId :response-time ms', {
  skip: (req, res) => req.path === '/healthz'
}))

// configure all routes
app.use(require('./routes'))

schema.applyMiddleware({
  app: app
});

app.use('/app', express.static('./client'))

// redirect home to /app for react app
app.use('/', (req, res) => {
  return res.redirect('/app')
})

app.listen(config.port, () => {
  ctx.logger.info({ port: config.port }, 'Listening')
})
