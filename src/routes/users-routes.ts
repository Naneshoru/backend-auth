import { NextFunction, Router } from 'express'
import { Request, Response } from 'express'
import protectRoute from 'middlewares/auth-middleware.ts'
import { UsersController } from 'controllers/users-controller.ts'

const usersRoutes = Router()

const usersController = new UsersController()

usersRoutes.get('/', protectRoute, (req: Request, res: Response, next: NextFunction) => {
  usersController.getUsers(req, res, next);
})

usersRoutes.post('/', (req: Request, res: Response, next: NextFunction) => {
  usersController.addUser(req, res, next);
})

usersRoutes.delete('/:userId', protectRoute, (req: Request, res: Response, next: NextFunction) => {
  usersController.deleteUser(req, res, next);
})

export default usersRoutes