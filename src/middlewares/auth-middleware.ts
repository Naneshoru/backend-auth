/// <reference path="../types/request.d.ts" />

import jwt from 'jsonwebtoken'
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { user: { id: string; name: string; email: string } }

    if (typeof decoded === 'object' && 'user' in decoded) {
      req.user = decoded.user
      next()
    } else {
      throw new Error('Token payload inválido')
    }
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' })
    return
  }
}

export default protectRoute