'use strict'
const {isDate} = require('lodash')

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
    },
    body: DataTypes.STRING,
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
    Message.associate = (models) => {
        // Message - 1:1 -> User
        Message.belongsTo(models.User, {
            as: 'author',
            foreignKey: {
                allowNull: true
            }
        })
    }

  return Message
}