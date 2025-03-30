import express, { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

import routes from 'routes/index'
import AppError from 'utils/app-error'
import { connectDB } from './database/db'

const app = express()

dotenv.config()

connectDB()

app.use(express.json())

app.use('/api', routes)

app.use((error: any, request: Request, response: Response, _: NextFunction): Promise<void> => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  response.status(500).json({ message: error.message })
})

app.listen(parseInt(process.env.PORT, 10) || 3030, process.env.HOST, () => {
  console.log( `Listening on port ${process.env.PORT}`)
})