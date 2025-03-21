import mongoose from 'mongoose'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User, IUser } from '../models/user.ts'
import AppError from 'utils/app-error.ts'
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
      if (!name || !email || !password) {
        throw new AppError('Campos obrigatórios (nome, email e senha)!')
      }
      const saltRounds = 10
      const hashed = await bcrypt.hash(password, saltRounds)

      const newUser: IUser = new User({ name, email, password: hashed })
      await newUser.save()
      
      res.status(201).json({ message: 'Usuário criado com sucesso!' })
    } catch (error) {
      next(new Error(`Erro ao criar usuário: ${(error as Error).message}`))
    }
  }

  async delete (req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError(`Id do usuário é inválido!`)
      }
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        throw new AppError(`Usuário não encontrado!`)
      }
  
      res.json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
      next(new Error(`Erro ao deletar usuário: ${(error as Error).message}`))
    }
  }
}

