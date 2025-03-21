import mongoose from 'mongoose'

export class UsersRepository {

  async list (text: string) {
    const res = mongoose.connection.
    collection('users').find({
      email: { $regex: text, $options: 'i' }
    }).toArray()

    console.log('[UsersRepository] list')
    return res
  }

  async create () {
    
  }

  async update () {

  }

  async delete () {

  }
}