import mongoose, { Document, Schema } from 'mongoose'

enum RoleType {
  ADMIN = 'admin',
  GUEST = 'guest'
}

export interface IUser extends Document {
  id: string
  name: string
  email: string
  password: string
  role: RoleType
  refreshToken?: string
}

const userSchema: Schema = new Schema<IUser>({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () {
    return this.isNew
  }},
  role: { type: String, required: function() {
    return this.isNew
  }},
  refreshToken: { type: String }
})

const User = mongoose.model<IUser>('User', userSchema)

export { User }
