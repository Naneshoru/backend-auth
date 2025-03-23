import { Router, Request, Response, NextFunction } from 'express'
import authenticate from 'middlewares/authenticate-middleware'
import { UsersController } from 'controllers/users-controller'
import { UsersRepository } from 'repository/users-repository'
import { UsersService } from 'services/users-service'
import authorizeRoles from 'middlewares/authorize-middleware'

const usersRoutes = Router()

const usersRepository = new UsersRepository()

const usersService = new UsersService(usersRepository)

const usersController = new UsersController(usersService)


usersRoutes.get(
  '/', 
  authenticate, 
  authorizeRoles('guest', 'admin'),
  (req: Request, res: Response, next: NextFunction) => {
    usersController.listAll(req, res, next);
  }
)

usersRoutes.post('/', 
  authenticate, 
  authorizeRoles('admin'), 
  (req: Request, res: Response, next: NextFunction) => {
    usersController.add(req, res, next);
  }
)

usersRoutes.put('/', 
  authenticate,
  authorizeRoles('admin'),
  (req: Request, res: Response, next: NextFunction) => {
    usersController.edit(req, res, next);
  }
)

usersRoutes.delete('/:userId', 
  authenticate,
  authorizeRoles('admin'), 
  (req: Request, res: Response, next: NextFunction) => {
    usersController.delete(req, res, next);
  }
)

export default usersRoutes