import 'dotenv/config'
import { Config } from './config.js'
import express from 'express'

const app = express()

app.get('/', (_, res: express.Response) => {
  res.send('Hello, TypeScript with Express!')
})

app.listen(Config.port, () => {
  console.log(`Server is listening on port ${Config.port}`)
})
