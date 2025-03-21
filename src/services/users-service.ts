import { UsersRepository } from "repository/users-repository"

export class UsersService {
  usersRepository

  constructor (usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async listAllUsers ({ text }: { text: string }) {
    const users = this.usersRepository.list(text)
    console.log('[UsersService] listAllUsers')
    return users
  }

  async createUser () {

  }

  async updateUser () {

  }

  async deleteUser () {

  }
}