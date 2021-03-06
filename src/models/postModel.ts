import mongoose, { Schema } from 'mongoose'
import { Comments } from './commentModel'
import { Users } from './userModel'

export const postSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  views: { type: Number, default: 0 },
  comments: [{ type: [ mongoose.Types.ObjectId ], ref: 'Comment', default: [] }],
  createdAt: { type: String },
  updatedAt: { type: String }
}, { timestamps: true })

export interface Posts extends mongoose.Document {
  user: Users
  username: string
  body: string
  likes?: Users[]
  views: number
  comments?: Comments[]
}

const Post = mongoose.model("Post", postSchema)
export default Post
