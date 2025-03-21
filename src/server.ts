import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from 'routes/index.ts'
import { logDocumentsInCollections } from './utils/utils.ts'
import AppError from 'utils/app-error.ts'

const app = express()

app.use(express.json())

dotenv.config()

app.use(cors())

main()
  .then(() => console.log('connected to db'))
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://localhost:27017/test')
  logDocumentsInCollections()
}

app.use('/api', routes)

app.use((error: any, request: Request, response: Response, _: NextFunction): Promise<void> => {

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  response.status(500).json({ message: error.message })
})

app.listen('3030', () => {
  console.log('Listening on port 3030')
})