'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const appRoot = require('app-root-path')
const config = require(appRoot + '/config/db/config.json')[env]
const rootCtx = require(appRoot + '/server/rootCtx')
const db = {}

let sequelize

let loggingConfig = { logging: (msg) => {
  // use bunyan logger
  if (msg && msg === 'Executing (default): SELECT 1') {
    return rootCtx.logger.trace(msg)
  }
  rootCtx.logger.debug(msg)
} }

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], loggingConfig)
} else {
  let c = Object.assign(config, loggingConfig)
  sequelize = new Sequelize(config.database, config.username, config.password, c)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
