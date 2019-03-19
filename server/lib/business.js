'use strict'

const _ = require('lodash')
const Promise = require('bluebird')

/**
 * A simple collection of business layer functions
 */

const removeUser = (ctx, id) => {
  return ctx.DataLayer.sequelize.transaction((transaction) => {
    return _removeWithTransaction(ctx.DataLayer.User, id, transaction)
  })
}

const submitUser = (ctx, userProperties) => {
  return ctx.DataLayer.sequelize.transaction(transaction => {
    return _upsertWithTransaction(ctx, ctx.DataLayer.User, userProperties, transaction)
  })
}

const removeChat = (ctx, id) => {
    return ctx.DataLayer.sequelize.transaction((transaction) => {
        return _removeWithTransaction(ctx.DataLayer.Chat, id, transaction)
    })
}

const submitChat = (ctx, chatProperties) => {
    return ctx.DataLayer.sequelize.transaction(transaction => {
      return _upsertWithTransaction(ctx, ctx.DataLayer.Chat, chatProperties, transaction)
    })
}

const removeMessage = (ctx, id) => {
    return ctx.DataLayer.sequelize.transaction((transaction) => {
        return _removeWithTransaction(ctx.DataLayer.Message, id, transaction)
    })
}

const submitMessage = (ctx, messageProperties) => {
    return ctx.DataLayer.sequelize.transaction(transaction => {
      return _upsertWithTransaction(ctx, ctx.DataLayer.Message, messageProperties, transaction)
    })
}

const _removeWithTransaction = (model, id, transaction) => {
    return model.destroy({
        where: { id },
        returning: true
    }, {transaction}).then((result) => {
        return Promise.resolve(result)
    })
}

const _upsertWithTransaction = (ctx, model, spec, transaction) => {
  if (_.has(spec, 'id')) {
    return model.update(spec, {transaction, returning: true, where: {id: spec.id}}).then(updateResult => {
      if (updateResult[0] === 0) {
        ctx.logger.warn({id: spec.id}, 'No records updated')
        return Promise.reject(new Error('No records updated'))
      }
      return Promise.resolve(updateResult[1][0])
    })
  }
  return model.create(spec, {transaction})
}

module.exports = {
    submitUser,
    removeUser,
    submitChat,
    removeChat,
    submitMessage,
    removeMessage
}
