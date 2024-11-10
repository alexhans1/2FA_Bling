import express from 'express'

import { AuthService } from '../services/auth.js'
import { Config } from '../config.js'

export class AuthController {
  private readonly authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  createUser: express.RequestHandler = async (req, res) => {
    await this.authService.createUser(req.body)
    res.status(201).send()
  }

  login: express.RequestHandler = async (req, res) => {
    const otpSessionToken = await this.authService.login(req.body)
    res
      .status(200)
      .cookie(Config.cookies.OTP_SESSION, otpSessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .send()
  }

  confirmOTP: express.RequestHandler = async (req, res) => {
    const otpSessionToken = req.cookies[Config.cookies.OTP_SESSION]

    const accessToken = await this.authService.confirmOtp(req.body.otp, otpSessionToken)
    res
      .status(200)
      .cookie(Config.cookies.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .clearCookie(Config.cookies.OTP_SESSION)
      .send()
  }

  logout: express.RequestHandler = (_req, res) => {
    res.clearCookie(Config.cookies.ACCESS_TOKEN).clearCookie(Config.cookies.OTP_SESSION).send()
  }

  requestOTP: express.RequestHandler = async (req, res) => {
    const { userId } = req
    const otpSessionToken = await this.authService.requestOTP(userId)
    res
      .status(200)
      .cookie(Config.cookies.OTP_SESSION, otpSessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      .send()
  }

  changePassword: express.RequestHandler = async (req, res) => {
    const otpSessionToken = req.cookies[Config.cookies.OTP_SESSION]

    await this.authService.changePassword({ ...req.body, userId: req.userId, otpSessionToken })
    res.status(200).clearCookie(Config.cookies.OTP_SESSION).send()
  }
}
