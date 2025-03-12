import mongoose from 'mongoose'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import protectRoute from './middlewares/auth-middleware.js'
import { User } from './models/user.js'

const router = express.Router()

router.get('/users', protectRoute, async (req, res) => {
  try {
    const { text = '' } = req.query
    const docs = await mongoose.connection.collection('users').find({
      email: { $regex: text, $options: 'i' }
    }).toArray()
    res.json(docs)
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar usuário: ${error.message}` })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Campos obrigatórios (nome, email e senha).' })
    }
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds)
    const newUser = new User({ name, email, password: hashed })
    await newUser.save()
    res.status(201).json({ message: 'Usuário criado com sucesso!' })
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar usuário: ${error.message}` })
  }
})

router.delete('/users/:userId', protectRoute, async (req, res) => {
  const { userId } = req.params
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Id do usuário é inválido' });
    }
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado com sucesso!' })
  } catch (error) {
    res.status(500).json({ error: `Erro ao deletar usuário: ${error.message}` })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ message: 'Credenciais inválidas.' })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: 'Credenciais inválidas.'})
  }

  const token = jwt.sign(
    { user: { id: user._id }}, 
    process.env.JWT_SECRET_KEY, 
    { expiresIn: '1h' }
  )

  res.json({ token })
})

export default router