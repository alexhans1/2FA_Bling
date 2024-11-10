import { BadRequestError } from 'http-error-classes'
import { totp } from 'otplib'
import { v4 as uuid } from 'uuid'

import { SMSService } from './sms.js'
import { OTP } from '../models/index.js'
import { Config } from '../config.js'

export type OTPSession = {
  userId: string
  sessionId: string
}

export class OTPService {
  private readonly SMSService: SMSService

  constructor() {
    this.SMSService = new SMSService()
  }

  async getOtp(otpSessionId: string, userId: string, otp: string): Promise<OTP> {
    const otpResponse = await OTP.findOne({ where: { userId, otp, sessionId: otpSessionId } })

    if (!otpResponse) {
      throw new BadRequestError('Invalid OTP')
    }

    if (otpResponse.dataValues.expiresAt < new Date()) {
      throw new BadRequestError('OTP expired')
    }

    return otpResponse
  }

  async createOTP(userId: string): Promise<{ otp: string; sessionId: string }> {
    const otp = totp.generate(Config.otp.secret)

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // expires in 10 minutes
    const sessionId = uuid()
    await OTP.create({ userId, otp, expiresAt, sessionId })

    return { otp, sessionId }
  }

  verifyOTP(otp: string): void {
    try {
      totp.check(otp, Config.otp.secret)
    } catch (error) {
      throw new BadRequestError('Invalid OTP at verifyOTP', { error })
    }
  }

  async sendOTP(otp: string, phoneNumber: string): Promise<void> {
    this.SMSService.send(`Your verification code is ${otp}`, phoneNumber)
  }
}
