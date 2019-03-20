'use strict'

const { gql } = require('apollo-server-express')

const PageInfo = gql`
  type PageInfo {
    totalCount: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    pageSize: Int
    pageNumber: Int
  }
`

module.exports = [
  PageInfo
]
