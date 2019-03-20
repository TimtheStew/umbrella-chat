'use strict'

const appRoot = require('app-root-path')
const _ = require('lodash')
const { submitUser, removeUser } = require(appRoot + '/server/lib/business')

module.exports = {
  Query: {
    chat (obj, {id}, context) {
      return context.DataLayer.Chat.findById(id)
    },
    allChats (obj, {condition, orderBy}, context) {
      let orderArray = generateOrderArray(orderBy)
      return context.DataLayer.Chat.findAll({
        where: condition,
        order: orderArray
      })
    }
  },
  Mutation: {
    submitChat (obj, args, context) {
      return submitChat(context, args)
    },
    removeChat (obj, args, context) {
      return removeChat(context, args.id)
    }
  }
}
