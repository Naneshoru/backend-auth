import { User, IUser } from 'models/user.ts'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import AppError from 'utils/app-error'

export class UsersRepository {

  async list (text: string) {
    const res = mongoose.connection.
    collection('users').find({
      email: { $regex: text, $options: 'i' }
    }).toArray()

    return res
  }

  async create ({ name, email, password }) {
    const saltRounds = 10
    const hashed = await bcrypt.hash(password, saltRounds)

    const newUser: IUser = new User({ name, email, password: hashed })
    await newUser.save()
  }

  async delete (userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(`Id do usuário é inválido!`)
    }
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError(`Usuário não encontrado!`)
    }
  }
}