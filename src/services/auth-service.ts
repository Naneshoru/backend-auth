import { AuthRepository } from "repository/auth-repository";
import jwt from 'jsonwebtoken'
import { DecodedToken } from "types/decoded-token";

export class AuthService {
  authRepository: AuthRepository

  constructor (authRepository: AuthRepository) {
    this.authRepository = authRepository
  }

  async login ({ email, password }) {
    const { token, refreshToken } = await this.authRepository.login({ email, password })

    return { token, refreshToken }
  }

  async refreshToken (rftoken: string) {
    const decoded = jwt.verify(
      rftoken, 
      process.env.JWT_SECRET_KEY
    ) as DecodedToken
  
    const { token, refreshToken } = await this.authRepository.refresh({ decoded, refreshToken: rftoken })

    return { token, refreshToken }
  }
}