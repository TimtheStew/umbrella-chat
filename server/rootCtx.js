'use strict'

const bunyan = require('bunyan')
const config = require('config')
const context = require('./context')

module.exports = context.root(bunyan.createLogger({
  name: 'umbrella-chat',
  level: config.logging.logLevel,
  src: config.logging.includeSrc === 'true',
  serializers: bunyan.stdSerializers
}))
