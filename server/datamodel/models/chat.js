'use strict'
const {isDate} = require('lodash')

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
    },
    name: DataTypes.STRING,
    users: DataTypes.JSON,
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return isDate(this.getDataValue('createdAt')) ? this.getDataValue('createdAt').toISOString() : undefined
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        return isDate(this.getDataValue('updatedAt')) ? this.getDataValue('updatedAt').toISOString() : undefined
      }
    }
  })

  // Associations
  Chat.associate = (models) => {
    // Chat - 1:M -> Messages
    Chat.hasMany(models.Message, {
      as: 'messages',
        foreignKey: 'chatId'
    })
  }

  return Chat
}