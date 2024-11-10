import { IsString, IsEmail } from 'class-validator'

class LoginDto {
  constructor({ email, password }: LoginDto) {
    this.email = email
    this.password = password
  }

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export default LoginDto
