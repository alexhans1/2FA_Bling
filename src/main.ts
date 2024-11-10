import 'dotenv/config'
import { Config } from './config.js'
import express from 'express'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import db from './models/index.js'
import { errorHandler } from './middlewares/index.js'

const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(express.json())
app.use(cookieParser())

db.authenticate()
  .then(async () => {
    console.log('Database connected')

    if (isDev) {
      // sync database only in development
      await db.sync()
      console.log('Database synced')
    }
  })
  .catch(err => {
    console.error('Error: ' + err)
  })

app.use('/api/v1', authRoutes, userRoutes)
app.use(errorHandler)

app.listen(Config.port, () => {
  console.log(`Server is listening on port ${Config.port}`)
})
