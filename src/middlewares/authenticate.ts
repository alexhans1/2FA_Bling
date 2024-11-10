import express from 'express'
import { HttpError } from 'http-error-classes'
import jwt from 'jsonwebtoken'

import { Config } from '../config.js'

// Extend the Express Request interface
// should go into types.d.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export const authMiddleware: express.RequestHandler = (req, _res, next) => {
  const accessToken = req.cookies[Config.cookies.ACCESS_TOKEN]

  try {
    const decodedToken = jwt.verify(accessToken, Config.jwt.secret)
    const userId = (decodedToken as { userId: string }).userId

    if (!userId) throw new Error()
    req.userId = userId
    next()
  } catch (_) {
    const error = new HttpError(401, 'Unauthorized')
    next(error)
  }
}
