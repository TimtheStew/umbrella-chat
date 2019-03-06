'use strict'

const _ = require('lodash')

/**
 * A convenience object for managing hierarchical state and coordinating a nest logger.
 */
class Context {
  constructor (logger, properties) {
    Object.assign(this, properties)
    this.logger = logger
    this._propKeys = _.keys(properties)
    Object.freeze(this)
  }

  _props () {
    let result = {}
    for (let i = 0; i < this._propKeys.length; i++) {
      result[this._propKeys[i]] = this[this._propKeys[i]]
    }
    return result
  }

  /**
   * Instantiate a child context that inherits the parent's properties with the additional
   * supplied properties.  Shadowed properties will be overwritten.
   * @param {object} newProps - The new properties to set on the child
   * @param {boolean} addToLogger - Whether or not to also add the property to the logger
   * @returns {Context} a new Context object
   */
  child (newProps, addToLogger = false) {
    let childLogger = (addToLogger) ? this.logger.child(newProps, true) : this.logger
    let childProps = this._props()
    Object.assign(childProps, newProps)
    return new Context(childLogger, childProps)
  }
}

const root = (logger, properties = {}) => new Context(logger, properties)

module.exports = { root }
