import { Table, Column, Model, PrimaryKey, DataType, Unique, HasMany } from 'sequelize-typescript'
import OTP from './otp.js'

@Table
class User extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  declare id: string

  @Column(DataType.STRING)
  declare name: string

  @Unique
  @Column(DataType.STRING)
  declare email: string

  @Column(DataType.STRING)
  declare passwordHash: string

  @Column(DataType.STRING)
  declare salt: string

  @Column(DataType.STRING)
  declare phone: string

  @HasMany(() => OTP)
  otp: OTP[]
}

export default User
