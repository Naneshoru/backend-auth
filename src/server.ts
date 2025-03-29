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

app.listen(3030, '0.0.0.0', () => {
  console.log('Listening on port 3030')
})