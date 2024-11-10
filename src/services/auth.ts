import { v4 as uuid } from 'uuid'
import { compare, genSalt, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BadRequestError, HttpError } from 'http-error-classes'
import { EmptyResultError } from 'sequelize'

import { OTPService, OTPSession } from './otp.js'
import { User } from '../models/index.js'
import { ChangePasswordDto, CreateUserDto, LoginDto } from '../routes/dtos/index.js'
import { Config } from '../config.js'

export class AuthService {
  private readonly OTPService: OTPService

  constructor() {
    this.OTPService = new OTPService()
  }

  async createUser({ name, email, password, phone }: CreateUserDto): Promise<void> {
    const { hashedPassword, salt } = await this.hashPassword(password)

    try {
      await User.create(
        {
          id: uuid(),
          name,
          email,
          passwordHash: hashedPassword,
          salt,
          phone,
        },
        { ignoreDuplicates: true },
      )
    } catch (error) {
      if (error instanceof EmptyResultError) {
        // user already exists, so do nothing
        // ensures idempotent behavior and ensures we're not exposing user emails
        return
      }
      throw error
    }
  }

  async login({ email, password }: LoginDto): Promise<string> {
    const dbResponse = await User.findOne({ where: { email } })
    if (!dbResponse) {
      throw new HttpError(404, 'User not found')
    }
    const user = dbResponse.dataValues

    const isPasswordMatch = await this.matchPassword(password, user.passwordHash)
    if (!isPasswordMatch) {
      throw new BadRequestError('Incorrect password')
    }

    const { otp, sessionId } = await this.OTPService.createOTP(user.id)

    this.OTPService.sendOTP(otp, user.phone)

    return this.createJWTToken<OTPSession>({ sessionId, userId: user.id })
  }

  async confirmOtp(otp: string, otpSession: string): Promise<string> {
    this.OTPService.verifyOTP(otp)

    const { userId, sessionId: otpSessionId } = this.decodeJWTToken<OTPSession>(otpSession)

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const otpResponse = await this.OTPService.getOtp(otpSessionId, userId, otp)

    const accessToken = this.createJWTToken({ userId })
    await otpResponse.destroy()

    return accessToken
  }

  async changePassword({
    oldPassword,
    newPassword,
    otp,
    userId: userIdFromAccessToken,
    otpSessionToken,
  }: ChangePasswordDto & { userId: string; otpSessionToken: string }): Promise<void> {
    this.OTPService.verifyOTP(otp)

    const { userId, sessionId: otpSessionId } = this.decodeJWTToken<OTPSession>(otpSessionToken)
    if (userIdFromAccessToken !== userId) {
      throw new BadRequestError('Invalid user')
    }

    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const isPasswordMatch = await this.matchPassword(oldPassword, user.passwordHash)
    if (!isPasswordMatch) {
      throw new BadRequestError('Incorrect password')
    }

    const otpResponse = await this.OTPService.getOtp(otpSessionId, userId, otp)
    await otpResponse.destroy()

    const { hashedPassword, salt } = await this.hashPassword(newPassword)
    await User.update({ passwordHash: hashedPassword, salt }, { where: { id: userId } })
  }

  async requestOTP(userId: string): Promise<string> {
    const dbResponse = await User.findOne({ where: { id: userId } })
    if (!dbResponse) {
      throw new HttpError(404, 'User not found')
    }
    const user = dbResponse.dataValues

    const { otp, sessionId } = await this.OTPService.createOTP(userId)
    this.OTPService.sendOTP(otp, user.phone)

    return this.createJWTToken<OTPSession>({ sessionId, userId })
  }

  private async hashPassword(password: string): Promise<{ hashedPassword: string; salt: string }> {
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)
    return { hashedPassword, salt }
  }

  private async matchPassword(dtoPassword: string, storedPasswordHash: string): Promise<boolean> {
    return await compare(dtoPassword, storedPasswordHash)
  }

  private createJWTToken<T extends Record<string, string>>(payload: T): string {
    return jwt.sign(payload, Config.jwt.secret, { expiresIn: '1h' })
  }

  private decodeJWTToken<T extends Record<string, string>>(token: string): T {
    try {
      return jwt.verify(token, Config.jwt.secret) as T
    } catch (error) {
      throw new BadRequestError('Invalid token', { error })
    }
  }
}
