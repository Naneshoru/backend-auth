import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { User } from "models/user.ts";
import AppError from "utils/app-error";

export class AuthRepository {
  async login ({ email, password }) {
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

    return { token, refreshToken }
  }

  async refresh ({ decoded, refreshToken }) {
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

    return { token, refreshToken: newRefreshToken }
  }
}