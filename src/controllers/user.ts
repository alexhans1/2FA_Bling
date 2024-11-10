import express from 'express'

import { UserService } from '../services/user.js'

export class UserController {
  private readonly userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  editUser: express.RequestHandler = async (req, res) => {
    await this.userService.editUser({ ...req.body, userId: req.userId })
    res.status(200).send()
  }
}
