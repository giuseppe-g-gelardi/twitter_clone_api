import mongoose, { Schema } from 'mongoose'

export const postSchema: Schema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  username: { type: String, default: null },
  body: { type: String, maxlength: 500, required: true },
}, { timestamps: true })

const Post = mongoose.model("Post", postSchema)
export default Post
