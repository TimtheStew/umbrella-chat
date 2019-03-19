'use strict'

const appRoot = require('app-root-path')
const { submitUser, removeUser } = require(appRoot + '/server/lib/business')

module.exports = {
  Query: {
    user (obj, {id}, context) {
      return context.DataLayer.User.findById(id)
    },
    allUsers (obj, {condition, orderBy}, context) {
      let orderArray = generateOrderArray(orderBy)
      return context.DataLayer.User.findAll({
        where: condition,
        order: orderArray
      })
    }
  },
  Mutation: {
    async submitUser (obj, args, context) {
      return submitUser(context, args)
    },
    removeUser (obj, args, context) {
      return removeUser(context, args.id)
    }
  }
}
