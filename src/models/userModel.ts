import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import { Posts } from './postModel'
import { Notifications } from './notificationsModel'

export const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  firstname: { type: String },
  lastname: { type: String },
  bio: { type: String, maxlength: 140 },
  location: { type: String, maxlength: 100 },
  profilePicture: { type: String, default: '' },
  profileBanner: { type: String, default: '' },
  protected: { type: Boolean, default: false },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post', default: [] }],
  notifications: { type: Array, default: [] },
  theme: { type: String, default: 'light'},
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

userSchema.methods.generateAuthToken = function(): string {
  return jwt.sign({ _id: this._id, username: this.username, email: this.email}, process.env.JWT!)
}

export interface Users extends mongoose.Document {
  _id: string
  username: string
  email: string
  password: string
  firstname?: string
  lastname?: string
  bio?: string
  location?: string
  profilePicture?: string
  profileBanner?: string
  protected?: boolean
  // followers?: Users[]
  followers?: mongoose.Types.Array<Users>
  // following?: Users[]
  following?: mongoose.Types.Array<Users>
  isAdmin?: boolean
  isVerified?: boolean
  posts?: Posts[]
  notifications?: Notifications[]
  theme?: string // could be boolean actually // prefersDark: t / f
  createdAt?: string
  updatedAt?: string
  generateAuthToken: Function
}

const User = mongoose.model("User", userSchema)
export default User
