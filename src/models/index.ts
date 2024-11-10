import { Sequelize } from 'sequelize-typescript'

import { Config } from '../config.js'
import User from './user.js'
import OTP from './otp.js'

const dbConfig = Config.db

const sequelize = new Sequelize('auth', 'user', 'pw', {
  logging: Config.isDevelopment,
  dialect: 'postgres',
  port: 5432,

  pool: dbConfig.pool,
  models: [User, OTP],
})

export default sequelize

export { User }
export { OTP }
