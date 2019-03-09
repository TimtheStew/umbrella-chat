'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    let sequelize = queryInterface.sequelize
    return sequelize.transaction((transaction) => {
      return queryInterface.createTable('Chats', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID
        },
        name: Sequelize.STRING,
        users: Sequelize.JSON,
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chats')
  }
}