import { User } from '../models/index.js'
import { EditUserDto } from '../routes/dtos/index.js'

export class UserService {
  async editUser({ userId, name, email }: EditUserDto & { userId: string }): Promise<void> {
    if (!name && !email) return

    await User.update(
      {
        name,
        email,
      },
      {
        where: {
          id: userId,
        },
      },
    )
  }
}
