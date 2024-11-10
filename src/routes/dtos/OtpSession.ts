import { IsString, Length } from 'class-validator'

class OtpSessionDto {
  constructor({ otp }: OtpSessionDto) {
    this.otp = otp
  }

  @IsString()
  @Length(6, 6)
  otp: string
}

export default OtpSessionDto
