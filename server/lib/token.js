'use strict'

const config = require('config')
const jwt = require('jsonwebtoken')

/**
 * Middleware that verifies JWT token provided as query param `token` is valid
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const verifyQueryParam = (req, res, next) => {
  if (config.secureGraphQL) { // if security enabled
    let token = req.query.token
    return verify(token, req, res, next)
  } else { // if security disabled noop
    next()
  }
}

/**
 * Middleware that verifies JWT token provided as Authorization: Bearer <token> header is valid
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const verifyAuthHeader = (req, res, next) => {
  if (config.secureGraphQL) { // if security enabled
    let token = req.get('Authorization')
    if (token && token.startsWith('Bearer ')) {
      return verify(token.substring(7), req, res, next)
    } else {
      res.status(401)
      return next('Unauthorized')
    }
  } else { // if security disabled noop
    next()
  }
}

/**
 * Verifies the given token
 * @param {string} token to verify
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verify = (token, req, res, next) => {
  if (config.secureGraphQL) { // if security enabled
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        res.status(401)
        return next(err)
      }
      req.context = req.context.child({ userId: decoded.id }, true)
      next()
    })
  } else { // if security disabled noop
    next()
  }
}

module.exports = { verifyQueryParam, verifyAuthHeader }
