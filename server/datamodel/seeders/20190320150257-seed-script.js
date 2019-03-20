'use strict';

const Promise = require('bluebird')
const _ = require('lodash')
const casual = require('casual')
const uuid = require(uuid/v4)
const {times, sample, range} = require('lodash')
const nodeRSA = require('node-rsa')
const fs = require('fs')

let users = []
/* 
this array is saved as seed-keys.json
keypairs = [
  { 
    uuid : 'someuuidv4', 
    public : 'somekeyPEM-pkcs8'
    private : 'somekeyPEM-pkcs8'
  }
]
*/
let keypairs = []
let messages = []
let chats = []

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return Promise.reduce([
      await queryInterface.bulkinsert('Users', generateUsers(25))
    ], () => {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};

// generates users, and saves their keys to seed-keys.json 
let generateUsers = (number) => {
  return times(number, () => {
    let key = new nodeRSA({b:2048})
    let id = uuid()
    let keypair = {
      user: id,
      private: key.exportKey('pkcs1-private'),
      public: key.exportKey('pkcs1-public')
    }
    keypairs.push(keypair)

    let date = new Date().toISOString()
    let user = {
      id: id,
      publicKey: keypair.public,
      gId: casual.uuid,
      firstName: casual.first_name,
      lastName: casual.last_name,
      displayName: casual.username,
      emailAddress: casual.email,
      imageURL: casual.url,
      accessToken: casual.uuid,
      createdAt: date,
      updatedAt: date
    }
    users.push(user)
    return user
  })
}
/*
user = {
  id : UUIDv4
  publicKey: string
  gId: 
  firstName
  lastName
  displayName
  emailAddress
  imageURL
  accessToken : String ^
  createdAt: Date
  updatedAt: Date
}


*/