import Router, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.ts'
import { DecodedToken } from '../types/decoded-token.ts'

class AuthController {

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.'})
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
  }

  refreshToken  = async (req: Request, res: Response) => {
    const { refreshToken } = req.body

    if (!refreshToken) { return res.status(401).json({ message: 'Token ausente' }) }
  
    try {
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ message: 'JWT secret key is not configured' });
      }
      const decoded = jwt.verify(
        refreshToken, 
        process.env.JWT_SECRET_KEY
      ) as DecodedToken
    
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      if (user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: 'Token inválido' });
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
      return res.status(403).json({ message: 'Token inválido ou expirado' })
    }
  }
}

export default AuthController