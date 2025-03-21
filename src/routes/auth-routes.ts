import { Router, Request, Response, NextFunction } from 'express'
import AuthController from 'controllers/auth-controller';
import { AuthService } from 'services/auth-service';
import { AuthRepository } from 'repository/auth-repository';

const authRoutes = Router()

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

authRoutes.post('/login', (req: Request, res: Response, next: NextFunction) => {
  authController.loginSession(req, res, next);
});

authRoutes.post('/refresh', (req: Request, res: Response, next: NextFunction) => { authController.refreshSession(req, res, next) });

export default authRoutes