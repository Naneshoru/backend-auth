import { Request, Response } from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User, IUser } from '../models/user.ts'

export class UsersController {
  async getUsers (req: Request, res: Response) {
    try {
      const { text = '' } = req.query
      const docs = await mongoose.connection.collection('users').find({
        email: { $regex: text, $options: 'i' }
      }).toArray()
      res.json(docs)
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar usuário: ${(error as Error).message}` })
    }
  }

  async addUser (req: Request, res: Response) {
    try {
      const { name, email, password }: { name: string; email: string; password: string } = req.body
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Campos obrigatórios (nome, email e senha).' })
      }
      const saltRounds = 10
      const hashed = await bcrypt.hash(password, saltRounds)
      const newUser: IUser = new User({ name, email, password: hashed })
      await newUser.save()
      res.status(201).json({ message: 'Usuário criado com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: `Erro ao criar usuário: ${(error as Error).message}` })
    }
  }

  async deleteUser (req: Request, res: Response) {
    const { userId } = req.params
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Id do usuário é inválido' });
      }
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      res.json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
      res.status(500).json({ error: `Erro ao deletar usuário: ${(error as Error).message}` })
    }
  }
}