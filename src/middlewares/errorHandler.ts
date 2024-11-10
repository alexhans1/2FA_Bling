import express from 'express'
import { Config } from '../config.js'

export const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err.stack)

  // don't expose errors in prod
  if (Config.isProduction) {
    res.status(500).json({ error: 'Internal Server Error' })
    return
  }

  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message })
}
