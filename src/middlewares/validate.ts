import express from 'express'
import { validateOrReject } from 'class-validator'

import * as DTOs from '../routes/dtos/index.js'

export const validate =
  (schema: (typeof DTOs)[keyof typeof DTOs]): express.RequestHandler =>
  async (req, res, next) => {
    try {
      const schemaToValidate = new schema(req.body)
      await validateOrReject(schemaToValidate)
      next()
    } catch (error) {
      console.error('error', error)
      res.status(400).send({ message: 'Invalid request', error })
    }
  }
