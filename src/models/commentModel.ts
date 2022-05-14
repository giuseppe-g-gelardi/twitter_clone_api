import mongoose, { Schema } from 'mongoose'
import { Replies } from './replyModel'

export const commentSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  views: { type: Number, default: 0 },
  replies: [{ type: [ mongoose.Types.ObjectId ], ref: 'Reply', default: []}],
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

export interface Comments extends mongoose.Document {
  user: string,
  username: string,
  body: string,
  likes?: string[],
  views: number,
  replies?: Replies[]
}

const Comment = mongoose.model("Comment", commentSchema)
export default Comment
