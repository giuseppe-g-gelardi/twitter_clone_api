import mongoose, { Schema } from 'mongoose'

export const commentSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  parent: { type: mongoose.Types.ObjectId, default: null },
  replies: { type: mongoose.Types.ObjectId, ref: 'Comment', default: []}
})

export interface Comments {
  user: string,
  username: string,
  body: string,
  likes?: string[],
  parent?: string,
  replies?: string[]
}

const Comment = mongoose.model("Comment", commentSchema)
export default Comment
