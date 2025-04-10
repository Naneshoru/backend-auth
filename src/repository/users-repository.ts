import { User, IUser } from 'models/user'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import AppError from 'utils/app-error'

export class UsersRepository {

  async list (text: string) {
    const res = await User.find({
      email: { $regex: text, $options: 'i' }
    }).select('name email')

    return res
  }

  async create ({ name, email, password }) {
    const saltRounds = 10
    const hashed = await bcrypt.hash(password, saltRounds)

    const newUser: IUser = new User({ name, email, 
      password: hashed, role: 'guest' })

    await newUser.save()
  }

  async update ({ id, name, email, password, role }) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Id do usuário é inválido!`)
    }
      try {
        const fields: Partial<IUser> = { name, email }
        if (password) {
          const saltRounds = 10
          fields.password = await bcrypt.hash(password, saltRounds)
        }
        if (role) {
          fields.role = role
        }

        const updatedUser: IUser = await User.findByIdAndUpdate(id, fields, { new: true })
    
        if (!updatedUser) {
          throw new Error(`Usuário não encontrado!`)
        }

        return updatedUser
      } catch (error) {
        throw new AppError(error.message)
      }
  }

  async delete (userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError(`Id do usuário é inválido!`)
    }
    const user = await User.deleteOne({ _id: userId });

    if (!user) {
      throw new AppError(`Usuário não encontrado!`)
    }
  }
}