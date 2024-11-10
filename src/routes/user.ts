import express from 'express'

import { UserController } from '../controllers/user.js'
import { validate as validationMiddleware, authMiddleware } from '../middlewares/index.js'
import { EditUserDto } from './dtos/index.js'
import { asyncHandler } from './asyncHandler.js'

const router = express.Router()

const userController = new UserController()

router.use('/user', authMiddleware)
router.put('/user', validationMiddleware(EditUserDto), asyncHandler(userController.editUser))

export default router
