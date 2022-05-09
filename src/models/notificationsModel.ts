import mongoose, { Schema } from 'mongoose'
import type { Users } from './userModel'

export const notificationSchema: Schema = new mongoose.Schema({
  to: { 
    userid: { type: String, required: true },
    username: { type: String, required: true }, 
  },
  from: { 
    userid: { type: String, required: true },
    username: { type: String, required: true },
    user: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
  },
  action: { 
    actionType: { type: String, required: true },
    actionOn: { type: String, required: true }
  },

  navToPost: { type: String, required: true },
  navToUser: { type: String, required: true },
  message: { type: String, required: true },
  commentid: { type: String },
  postid: { type: String },
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

export interface NotificationType {
  _id: string
  to: {
    userid: string,
    username: string
  }
  from: {
    userid: string,
    username: string,
    user: any
  }
  action: {
    actionType: string,
    actionOn: string
  }
  navToPost: string
  navToUser: string
  message: string
  commentid?: string
  postid?: string
  createdAt?: string
  updatedAt?: string
}

const Notification = mongoose.model("Notification", notificationSchema)
export default Notification

