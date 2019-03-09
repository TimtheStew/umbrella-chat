'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    let sequelize = queryInterface.sequelize
    return sequelize.transaction((transaction) => {
      return queryInterface.createTable('Messages', {
        id: {
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          type: Sequelize.UUID
        },
        body: Sequelize.STRING,
        authorId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
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
    return queryInterface.dropTable('Messages')
  }
}