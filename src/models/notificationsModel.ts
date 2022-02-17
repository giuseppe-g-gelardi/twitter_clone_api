import mongoose, { Schema } from 'mongoose'
import { Users } from './userModel'

export const notificationSchema: Schema = new mongoose.Schema({
  to: { type: mongoose.Types.ObjectId, ref: 'User' },
  from: { type: mongoose.Types.ObjectId, ref: 'User' },
  body: { type: String }
})

export type Notifications = {
  to: Users
  from: Users
  body: string
}
