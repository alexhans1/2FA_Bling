import { IsString, IsEmail, MaxLength, IsOptional } from 'class-validator'

class EditUserDto {
  constructor({ name, email }: EditUserDto) {
    this.name = name
    this.email = email
  }

  @IsOptional()
  @IsString()
  @MaxLength(30)
  name?: string

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string
}

export default EditUserDto
