'use strict'

const appRoot = require('app-root-path')
const _ = require('lodash')
const { submitMessage, removeMessage } = require(appRoot + '/server/lib/business')

module.exports = {
  Query: {
    message (obj, {id}, context) {
      return context.DataLayer.Chat.findById(id)
    },
    allMessages (obj, {condition, orderBy}, context) {
      let orderArray = generateOrderArray(orderBy)
      return context.DataLayer.Chat.findAll({
        where: condition,
        order: orderArray
      })
    }
  },
  Mutation: {
    submitMessage (obj, args, context) {
      return submitMessage(context, args)
    },
    removeMessage (obj, args, context) {
      return removeMessage(context, args.id)
    }
  }
}
