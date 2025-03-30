import mongoose from 'mongoose'
import { logDocumentsInCollections } from 'utils/utils'

const connectDB = async () => { 
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Conectado ao MongoDB')

    logDocumentsInCollections()
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error)
    process.exit(1)
  }
}

export { connectDB }

const memdb = [
  {
    "name": "Test",
    "email": "test@example.com",
    "password": "$2b$10$gjEngjRb6zm0Aj1pbDk4dup8QZhJ49o/8oDhEfPWX8fwUru6.F48u"
  }, 
  {
    "name": "Renato",
    "email": "renatinho@outlook.com.br",
    "password": "$2b$10$IPQzSO/NeoogXpenuD36UecvjXsfP8AaBZmCJiysZ9.ZSCrZN3Rby"
  }, 
  {
    "name": "Ricardo",
    "email": "atakiama@outlook.com.br",
    "password": "$2b$10$6/xmQOWWMChrEZm7T0CDCuBnsKIOmv6TAKPqpBG1GYk6sXbgh.lGm",
  },
  {
    "name": "Atakiama",
    "email": "vitor@satoshi.com",
    "password": "$2b$10$lQUot1uG/1d4B0qoZ3h7hOvnWHNpGEdhq1fOzM7ajVP9cpMUGoPBu"
  },
  {
    "name": "Isadora",
    "email": "isadora@batista.com",
    "password": "$2b$10$Cv9cXuDdhybzB3fzhhzml..b8.P4..eSTxwOIpKdpD8sUmkbmCVR."
  },
  {
    "name": "Dado Dolabela",
    "email": "dado@dolabela",
    "password": "$2b$10$MKqNNxqBViELknvD01nce.UfBrEWaiZ85SS8wakKPovOR1UuB0DE6",
  },
  {
    "name": "Renato2",
    "email": "renatinho2@outlook.com.br",
    "password": "$2b$10$R7vcWEnY7tqMS.x5bq0lU.BHCOcMqipLXbzFJJW66Q7bKjcOL0s6q",
  }
]