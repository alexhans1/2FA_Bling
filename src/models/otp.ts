import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript'
import User from './user.js'

@Table
class OTP extends Model {
  @Column(DataType.UUID)
  @ForeignKey(() => User)
  declare userId: string

  @Column(DataType.STRING)
  declare otp: string

  @Column(DataType.UUID)
  declare sessionId: string

  @Column(DataType.DATE)
  declare expiresAt: Date
}

export default OTP
