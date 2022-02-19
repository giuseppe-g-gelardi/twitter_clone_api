import mongoose, { Schema } from 'mongoose'
import { Comments } from './commentModel'
import { Users } from './userModel'

export const postSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
  likes: { type: [ mongoose.Types.ObjectId ], default: [] },
  comments: [{ type: [ mongoose.Types.ObjectId ], ref: 'Comment', default: [] }],
}, { timestamps: true })

export interface Posts {
  user: Users
  username: string
  body: string
  likes?: Users[]
  comments?: Comments[]
}

const Post = mongoose.model("Post", postSchema)
export default Post
