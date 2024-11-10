import dotenv from 'dotenv'

const { parsed: config } = dotenv.config()
if (!config) throw new Error('Missing .env file')

export const Config = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: parseInt(config.PORT || '8080'),
  db: {
    USER: config.DB_USER || '',
    PASSWORD: config.DB_PASSWORD || '',
    DB: config.DB_NAME || '',
    port: 5432,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  jwt: {
    secret: config.JWT_SECRET || '',
  },
  otp: {
    secret: config.OTP_SECRET || '',
  },
  cookies: {
    OTP_SESSION: 'OTP_SESSION',
    ACCESS_TOKEN: 'ACCESS_TOKEN',
  },
}
