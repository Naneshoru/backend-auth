import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from 'routes/index.ts'
import { logDocumentsInCollections } from './utils.ts'

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

app.listen('3030', () => {
  console.log('Listening on port 3030')
})