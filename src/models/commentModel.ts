import mongoose, { Schema } from 'mongoose'

export const commentSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  parent: { type: mongoose.Types.ObjectId, ref: 'Comment', default: null },
  replies: { type: [ mongoose.Types.ObjectId ], ref: 'Comment', default: []},
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

export interface Comments {
  user: string,
  username: string,
  body: string,
  likes?: string[],
  parent?: Comment,
  replies?: Comment[]
}

const Comment = mongoose.model("Comment", commentSchema)
export default Comment
