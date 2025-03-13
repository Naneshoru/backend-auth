import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  refreshToken: String
})

const User = mongoose.model('User', userSchema)

export { User }