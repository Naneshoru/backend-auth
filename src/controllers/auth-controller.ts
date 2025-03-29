import Router, { NextFunction, Request, Response } from 'express'

import { AuthService } from 'services/auth-service'
import AppError from 'utils/app-error'

class AuthController {
  authService: AuthService

  constructor (authService: AuthService) {
    this.authService = authService
  }
  
  loginSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const { email, password } = req.body

      if (!email || !password) {
        throw (new AppError(`Campos obrigatórios!`))
      }
  
      const { token, refreshToken } = await this.authService.login({ email, password })
  
      return res.json({ token, refreshToken })
    } catch (error) {
      next(new Error(`Erro ao fazer login: ${(error as Error).message}`))
    }
  }

  refreshSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      
      if (!secretKey) {
        throw (new Error('JWT secret key is not configured'))
      }

      const { refreshToken: refreshtoken } = req.body

      if (!refreshtoken) {
        throw (new AppError('Token ausente', 401))
      }
      
      const { token, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshtoken)
    
      return res.json({ token, refreshToken: newRefreshToken })
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController