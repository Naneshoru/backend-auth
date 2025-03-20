import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  id: string
  name: string
  email: string
  password: string
  refreshToken?: string
}

const userSchema: Schema = new Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
})

const User = mongoose.model<IUser>('User', userSchema)

export { User }
