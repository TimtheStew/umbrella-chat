'use strict'
const {isDate} = require('lodash')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID
    },
    publicKey: DataTypes.STRING,
    gId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    displayName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    accessToken: DataTypes.STRING,
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

  return User
}