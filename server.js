const express = require('express')

const app = express()

app.use(express.json())

const routes = require('./routes')

const mongoose = require('mongoose')

const logDocumentsInCollections = require('./utils')

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