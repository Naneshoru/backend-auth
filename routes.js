const mongoose = require('mongoose')
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.json('Hello world')
})

router.get('/users', async (req, res) => {
  const { text = '' } = req.query
  const docs = await mongoose.connection.collection('users').find({
    email: { $regex: text, $options: 'i' }
  }).toArray()
  res.json(docs)
})

router.post('/register', (req, res) => {
  
  res.json('Hello world')
})

module.exports = router