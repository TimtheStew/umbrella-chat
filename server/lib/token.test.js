
/* eslint-env jest */
'use strict'
const jwt = require('jsonwebtoken')
const appRoot = require('app-root-path')
const rootCtx = require(appRoot + '/server/rootCtx')

describe('token', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('config', () => {
      return {
        secureGraphQL: true,
        jwt: {
          secret: 'supersecret',
          expiresIn: '30 days'
        }
      }
    })
  })
  it('verify valid token header', () => {
    const token = require('./token')
    const config = require('config')
    expect.assertions(4)
    let accessToken = jwt.sign({ id: '123' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
    let req = mockRequest()
    req.set('Authorization', `Bearer ${accessToken}`)
    let mockResponse = jest.fn()
    let mockNext = jest.fn()

    token.verifyAuthHeader(req, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledWith()
    expect(mockResponse).not.toHaveBeenCalled()
    expect(req.context.userId).toBe('123')
  })
  it('malformed header', () => {
    const token = require('./token')
    let req = mockRequest()
    req.set('Authorization', `INVALID token`)
    let mockStatus = jest.fn()
    let mockResponse = {
      status: mockStatus
    }

    let mockNext = jest.fn()

    token.verifyAuthHeader(req, mockResponse, mockNext)

    expect(mockStatus).toHaveBeenCalledWith(401)
    expect(mockNext).toHaveBeenCalledWith('Unauthorized')
  })
  it('token as query param', () => {
    const token = require('./token')
    const config = require('config')
    expect.assertions(4)
    let accessToken = jwt.sign({ id: '123' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
    let req = mockRequest()
    req['query'] = { token: accessToken }
    let mockResponse = jest.fn()
    let mockNext = jest.fn()

    token.verifyQueryParam(req, mockResponse, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledWith()
    expect(mockResponse).not.toHaveBeenCalled()
    expect(req.context.userId).toBe('123')
  })
})

describe('auth disabled', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('config', () => {
      return {
        secureGraphQL: false
      }
    })
  })
  it('token auth header disabled', () => {
    const token = require('./token')
    let mockNext = jest.fn()

    token.verifyAuthHeader(undefined, undefined, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledWith()
  })
  it('token query param disabled', () => {
    const token = require('./token')
    let mockNext = jest.fn()

    token.verifyQueryParam(undefined, undefined, mockNext)
    expect(mockNext).toHaveBeenCalledTimes(1)
    expect(mockNext).toHaveBeenCalledWith()
  })
})

const mockRequest = () => {
  let req = new Map()
  req.context = rootCtx
  return req
}
