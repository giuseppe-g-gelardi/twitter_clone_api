import mongoose, { Schema } from 'mongoose'
import { Users } from './userModel'

export const postSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  parent: { type: mongoose.Types.ObjectId, defualt: null },
  replies: [{ type: mongoose.Types.ObjectId, ref: 'Reply', default: [] }],
}, { timestamps: true })

export type Posts = {
  user: Users
  username: string
  body: string
  likes: Users[]
  parent: Posts
  replies: Posts[]
}

const Post = mongoose.model("Post", postSchema)
export default Post
