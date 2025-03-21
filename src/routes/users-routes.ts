import { Router } from 'express'
import { Request, Response } from 'express'
import protectRoute from 'middlewares/auth-middleware.ts'
import { UsersController } from 'controllers/users-controller.ts'

const usersRoutes = Router()

const usersController = new UsersController()

usersRoutes.get('/', protectRoute, (req: Request, res: Response) => {
  console.log('get users')
  usersController.getUsers(req, res);
})

usersRoutes.post('/', (req: Request, res: Response) => {
  usersController.addUser(req, res);
})

usersRoutes.delete('/:userId', protectRoute, (req: Request, res: Response) => {
  usersController.deleteUser(req, res);
})

export default usersRoutes