import mongoose, { Schema } from 'mongoose';

export const replySchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  comment: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

export interface Replies {
  user: string,
  body: string
  likes?: string[]
  comment: Comment
}

const Reply = mongoose.model("Reply", replySchema)
export default Reply
