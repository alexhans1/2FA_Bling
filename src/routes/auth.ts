import express from 'express'

import { AuthController } from '../controllers/auth.js'
import { validate as validationMiddleware, authMiddleware } from '../middlewares/index.js'
import { ChangePasswordDto, CreateUserDto, LoginDto, OtpSessionDto } from './dtos/index.js'
import { asyncHandler } from './asyncHandler.js'

const router = express.Router()

const authController = new AuthController()

router.post('/auth/register', validationMiddleware(CreateUserDto), asyncHandler(authController.createUser))
router.post('/auth/login', validationMiddleware(LoginDto), asyncHandler(authController.login))
router.post('/auth/confirm-otp', validationMiddleware(OtpSessionDto), asyncHandler(authController.confirmOTP))
router.post('/auth/logout', asyncHandler(authController.logout))
router.post('/auth/otp', authMiddleware, asyncHandler(authController.requestOTP))
router.put(
  '/auth/password',
  authMiddleware,
  validationMiddleware(ChangePasswordDto),
  asyncHandler(authController.changePassword),
)

export default router
