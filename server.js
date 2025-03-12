const express = require('express')

const app = express()

app.use(express.json())

const mongoose = require('mongoose')

const { logDocumentsInCollections } = require('./utils')

main()
  .then(what => console.log('listening to ', what))
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://localhost:27017/test')
  logDocumentsInCollections()
}

app.get('/', (req, res) => {
  res.json('Hello world')
})

app.post('/register', (req, res) => {
  
  res.json('Hello world')
})

app.listen('3000', () => {
  console.log('Listening on port 3000')
})