/* eslint-env jest */
'use strict'

const bunyan = require('bunyan')
const context = require('./context')

const rootLogger = bunyan.createLogger({ name: 'test' })

describe('context', () => {
  test('makes a child with a new property not added to logger', () => {
    let root = context.root(rootLogger)
    let child = root.child({ foo: 'bar' }, false)
    expect(child.foo).toEqual('bar')
    expect(child.logger).toBe(rootLogger)
    expect(child.logger.fields.foo).toBeUndefined()
  })

  test('makes a child with a new property added to logger', () => {
    let root = context.root(rootLogger)
    let child = root.child({ foo: 'bar' }, true)
    expect(child.foo).toEqual('bar')
    expect(child.logger.fields.foo).toEqual('bar')
  })

  test('makes a child with an overridden property', () => {
    let root = context.root(rootLogger, { foo: 'bar' })
    let child = root.child({ foo: 'bazzzz' }, true)
    expect(root.foo).toEqual('bar')
    expect(child.foo).toEqual('bazzzz')
    expect(child.logger.fields.foo).toEqual('bazzzz')
  })

  test('makes a child with multiple new properties added to logger', () => {
    let root = context.root(rootLogger)
    let child = root.child({ foo: 'bar', yep: 'yay' }, true)
    expect(child.foo).toEqual('bar')
    expect(child.yep).toEqual('yay')
    expect(child.logger.fields.foo).toEqual('bar')
    expect(child.logger.fields.yep).toEqual('yay')
  })
})
