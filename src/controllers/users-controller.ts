import { NextFunction, Request, Response } from 'express'
import { UsersService } from 'services/users-service.ts'

export class UsersController {
  usersService

  constructor (usersService: UsersService) {
    this.usersService = usersService
  }

  async listAll (req: Request, res: Response, next: NextFunction) {
    try {
    const { text = '' } = req.query
      const users = await this.usersService.listAllUsers({ text })

      res.json(users)
    } catch (error) {
      next(new Error(`Erro ao buscar usuário: ${(error as Error).message}`))
    }
  }

  async add (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password }: { name: string; email: string; password: string } = req.body
     
      const updatedUser = await this.usersService.createUser({ name, email, password })
      
      res.status(201).json({ message: 'Usuário criado com sucesso!',
       user: updatedUser
      })
    } catch (error) {
      next(new Error(`Erro ao criar usuário: ${(error as Error).message}`))
    }
  }

  async edit (req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name, email, password } = req.body

      await this.usersService.updateUser({ id, name, email, password })
      res.status(204).send({ message: 'Usuário editado com sucesso!' })
    } catch (error) {
      next(new Error(`Erro ao editar usuário: ${(error as Error).message}`))
    }
  }

  async delete (req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      await this.usersService.deleteUser(userId)
  
      res.json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
      next(new Error(`Erro ao deletar usuário: ${(error as Error).message}`))
    }
  }
}

