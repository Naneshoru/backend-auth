/// <reference path="../types/request.d.ts" />

import jwt, { JwtPayload } from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import AppError from 'utils/app-error'

const authenticate = (req: Request, res: Response, next: NextFunction): void  => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY não definido nas variáveis de ambiente')
  }
  
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('Não há cabeçalho de autorização!', 401)
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    throw new AppError('Token não fornecido!', 401)
  }

  try {
    jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY,
    (err, decoded: JwtPayload) => {
      if (err) {
        throw new AppError('Token payload inválido!', 401)
      }
      req.user = decoded.user
      next()
    })
  } catch (error) {
    throw new AppError('Token inválido!', 401)
  }
}

export default authenticate