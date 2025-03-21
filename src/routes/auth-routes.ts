import { Router, Request, Response, NextFunction } from 'express'
import AuthController from './../controllers/auth-controller';

const authRoutes = Router()

const authController = new AuthController()

authRoutes.post('/login', (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res, next);
});

authRoutes.post('/refresh', (req: Request, res: Response, next: NextFunction) => { authController.refreshToken(req, res, next) });

export default authRoutes