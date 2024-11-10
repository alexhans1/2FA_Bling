import { IsString, IsStrongPassword, Length } from 'class-validator'

class ChangePasswordDto {
  constructor({ oldPassword, newPassword, otp }: ChangePasswordDto) {
    this.oldPassword = oldPassword
    this.newPassword = newPassword
    this.otp = otp
  }

  @IsString()
  @Length(6, 6)
  otp: string

  @IsString()
  oldPassword: string

  @IsString()
  @IsStrongPassword()
  newPassword: string
}

export default ChangePasswordDto
