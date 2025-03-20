import { DecodedToken } from './../types/decoded-token.ts';
import jwt from 'jsonwebtoken'
import type { NextFunction, Request , Response } from 'express'

const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Não há cabeçalho de autorização' });
  }

  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY não definido nas variáveis de ambiente');
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY as string) as unknown as DecodedToken;

    if (typeof decoded === 'object' && 'user' in decoded) {
      req.user = decoded.user;
    } else {
      throw new Error('Token payload inválido');
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default protectRoute