import Router, { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.ts'
import { DecodedToken } from '../types/decoded-token.ts'
import AppError from 'utils/app-error.ts'

class AuthController {

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const { email, password } = req.body

      if (!email || !password) {
        throw (new AppError(`Campos obrigatórios!`))
      }
  
      const user = await User.findOne({ email })
  
      if (!user) {
        throw (new AppError(`Credenciais inválidas!`))
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        throw (new AppError(`Credenciais inválidas!`))
      }
  
      const token = jwt.sign(
        { 
          user: { 
            id: user._id, name: user.name, email: user.email 
          }
        },
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '15m' }
      )
  
      const refreshToken = jwt.sign(
        { 
          user: { 
            id: user._id, name: user.name, email: user.email 
          }
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      )
  
      user.refreshToken = refreshToken
      await user.save()
  
      return res.json({ token, refreshToken })
    } catch (error) {
      next(new Error(`Erro ao fazer login: ${(error as Error).message}`))
    }
  }

  refreshToken  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        throw (new Error('JWT secret key is not configured'))
      }

      const { refreshToken } = req.body

      if (!refreshToken) { 
        throw (new AppError('Token ausente', 401))
      }

      
      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_SECRET_KEY
      ) as DecodedToken
    
      const user = await User.findById(decoded.user.id);
      if (!user) {
        throw (new AppError('Usuário não encontrado', 404))
      }
  
      if (user.refreshToken !== refreshToken) {
        throw (new AppError('Token inválido', 403))
      }
    
      const token = jwt.sign(
        { 
          user: { 
            id: user._id, name: user.name, email: user.email 
          }
        }, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '15m' }
      )
    
      const newRefreshToken = jwt.sign(
        { 
          user: { 
            id: user._id, name: user.name, email: user.email 
          }
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      )
    
      user.refreshToken = newRefreshToken
      await user.save()
    
      return res.json({ token, refreshToken: newRefreshToken })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController