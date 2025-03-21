/// <reference path="../types/request.d.ts" />

import jwt, { JwtPayload } from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

const protectRoute = (req: Request, res: Response, next: NextFunction): void  => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ message: 'Não há cabeçalho de autorização' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' })
    return
  }
  
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY não definido nas variáveis de ambiente')
    }

    jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY,
    (err, decoded: JwtPayload) => {
      if (err) {
        res.status(401).json({ message: 'Token payload inválido' })
        return
      }
      req.user = decoded.user
      next()
    })
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
    return
  }
}

export default protectRoute