import { Router } from "express"
import usersRoutes from "./users-routes"
import authRoutes from "./auth-routes"

const router = Router()

router.use('/users', usersRoutes)
router.use('/auth', authRoutes)

export default router