import { UsersRepository } from "repository/users-repository"
import AppError from "utils/app-error"

export class UsersService {
  usersRepository

  constructor (usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async listAllUsers ({ text }: { text: string }) {
    const users = this.usersRepository.list(text)
    return users
  }

  async createUser ({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError('Campos obrigatórios (nome, email e senha)!')
    }
    
    await this.usersRepository.create({ name, email, password })
  }

  async updateUser ({ id, name, email, password }) {
    try {
      const updatedUser = await this.usersRepository.update({ id, name, email, password })
      return updatedUser
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  async deleteUser (userId: string) {
    await this.usersRepository.delete(userId)
  }
}