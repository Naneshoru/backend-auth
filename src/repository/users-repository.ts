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
    if (!name || name.trim().length === 0) {
      throw new AppError('O nome é obrigatório e não pode estar vazio!')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      throw new AppError('O email é inválido!')
    }

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

    if (name && name.trim().length === 0) {
      throw new AppError('O nome não pode estar vazio!')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      throw new AppError('O email é inválido!')
    }

    if (password && password.length < 6) {
      throw new AppError('A senha deve ter pelo menos 6 caracteres!')
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