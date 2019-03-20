'use strict'

const changeCase = require('change-case')
const sequelize = require('sequelize')
const {flatten} = require('lodash')

/**
 * Generate a series of order by enumerations given a graphQL type definition
 * @param {String} enumName - name of enumeration
 * @param {String} fields - Graphql schema containing attributes
 */
const generateOrderByEnum = (enumName, fields) => {
  let keys = fields
    .split('\n') // split string on new lines
    .map(l => l.trim()) // trim all white space
    .filter(l => l.length > 0) // remove empty lines
    .filter(l => !l.startsWith('#')) // remove lines with comments
    .filter(l => l.includes(':')) // ensure lines have key value pairs
    .map(l => l.split(':')[0]) // get keys
    .map(l => changeCase.constantCase(l)) // change from camelCase to snake_case and change to all upper case
    .map(l => [`${l}_ASC`, `${l}_DESC`]) // create ASC and DESC enums

  // return graphql enum type
  return `
    enum ${enumName} {
      ${flatten(keys).join('\n')}
    }
  `
}

/**
 * Takes a graphQL field definition returns field definition with
 * graphQL scalar types wrapped in arrays.
 * @example
 * let field = 'foo: String'
 * fieldsToCondition(field)
 * // returns 'foo: [String]'
 * @param {string} fields - graphQL field definition
 */
const fieldsToCondition = (fields) => {
  return fields.replace(/(String|Int|Float|Boolean|PersonInput)(?!\[|\])/g, (type) => `[${type}]`)
}

module.exports = {
    fieldsToCondition,
    generateOrderByEnum
}