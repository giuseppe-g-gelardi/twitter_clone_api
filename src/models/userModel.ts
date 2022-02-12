import mongoose, { Schema } from 'mongoose'

export const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isProtected: { type: Boolean, default: false },
  
})


