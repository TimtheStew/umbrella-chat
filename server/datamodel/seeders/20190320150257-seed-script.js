'use strict';

const Promise = require('bluebird')
const _ = require('lodash')
const casual = require('casual')
const uuid = require('uuid/v4')
const {times, sample, range, sampleSize} = require('lodash')
const nodeRSA = require('node-rsa')
const fs = require('fs')

/* this array is saved as seed-keys.json
keypairs = [ { 
    uuid : 'someuuidv4', 
    public : 'somekeyPEM-pkcs8'
    private : 'somekeyPEM-pkcs8'
  }
]*/
let keypairs = []
/*
userDatas = [ {
    id: uuidv4
    publicKey: keyPEM-pkcs8
  } 
]*/
let userDatas = []
let users = []
let chats = []

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return Promise.reduce([
      await queryInterface.bulkInsert('Users', generateUsers(5)),
      await queryInterface.bulkInsert('Chats', generateChats(10)),
      await queryInterface.bulkInsert('Messages', generateMessages(40))
    ], () => {})
  },

  down: async(queryInterface, Sequelize) => {
    return Promise.reduce([
      await queryInterface.bulkDelete('Messages', null, {}),
      await queryInterface.bulkDelete('Chats', null, {}),
      await queryInterface.bulkDelete('Users', null, {})
    ], () => {})
  }
};

let generateUsers = (number) => {
  return times(number, () => {
    let key = new nodeRSA({b:2048})
    let id = uuid()
    let keypair = {
      user: id,
      private: key.exportKey('pkcs1-private'),
      public: key.exportKey('pkcs1-public')
    }

    let date = new Date().toISOString()
    let user = {
      id: id,
      publicKey: keypair.public,
      gId: casual.uuid,
      firstName: casual.first_name,
      lastName: casual.last_name,
      displayName: casual.username,
      emailAddress: casual.email,
      imageUrl: casual.url,
      accessToken: casual.uuid,
      createdAt: date,
      updatedAt: date
    }
    let userData = {
      id: id,
      publicKey: keypair.public
    }

    userDatas.push(userData)
    keypairs.push(keypair)
    users.push(user)

    console.log("user")
    return user
  })
}

let generateChats = (number) => {
  return times(number, () => { 
    let date = new Date().toISOString()
    let userStrings = []
    //a chat is either 2 people or 2-8 people
    let chatUsers = sampleSize(userDatas, casual.integer(2,casual.coin_flip ? 2 : 8))
    chatUsers.forEach(user => {userStrings.push(JSON.stringify(user))})
    let chat = {
      id: uuid(),
      name: casual.title,
      //either 2 person or 2-8 person chat
      users: userStrings,
      createdAt: date,
      updatedAt: date
    }
    chats.push(chat)
    console.log("chat")
    return chat
  })
}

let generateMessages = (number) => {
  return times(number, () => {
    let msgText = casual.sentences(casual.integer(1,10))
    let chat = sample(chats)
    let chatUsers = JSON.parse(chat.users)
    let msgBody = []
    let key = new nodeRSA()
    //encrypt for each user
    chatUsers.forEach(user => {
      key.importKey(user.publicKey, 'pkcs8')
      encryptedMsg = key.encrypt(msgText)
      msgBody.push(
        JSON.stringify({
          userId: user.id,
          message: encryptedMsg
        })
      )
    });
    let message = {
      id: uuid(),
      body: msgBody,
      chatId: chat.id,
      authorId: sample(users).id,
    }
    console.log("message")
    return message
  })
}
