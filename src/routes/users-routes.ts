import { NextFunction, Router } from 'express'
import { Request, Response } from 'express'
import protectRoute from 'middlewares/auth-middleware.ts'
import { UsersController } from 'controllers/users-controller.ts'
import { UsersRepository } from 'repository/users-repository'
import { UsersService } from 'services/users-service'

const usersRoutes = Router()

const usersRepository = new UsersRepository()

const usersService = new UsersService(usersRepository)

const usersController = new UsersController(usersService)


usersRoutes.get('/', protectRoute, (req: Request, res: Response, next: NextFunction) => {
  usersController.listAll(req, res, next);
})

usersRoutes.post('/', (req: Request, res: Response, next: NextFunction) => {
  usersController.add(req, res, next);
})

usersRoutes.put('/', (req: Request, res: Response, next: NextFunction) => {
  usersController.edit(req, res, next);
})

usersRoutes.delete('/:userId', protectRoute, (req: Request, res: Response, next: NextFunction) => {
  usersController.delete(req, res, next);
})

export default usersRoutes