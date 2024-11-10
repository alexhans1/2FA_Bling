import { IsString, IsEmail, IsPhoneNumber, MaxLength, IsStrongPassword } from 'class-validator'

class CreateUserDto {
  constructor({ name, email, password, phone }: CreateUserDto) {
    this.name = name
    this.email = email
    this.password = password
    this.phone = phone
  }

  @IsString()
  @MaxLength(30)
  name: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsStrongPassword()
  password: string

  @IsString()
  @IsPhoneNumber()
  phone: string
}

export default CreateUserDto
