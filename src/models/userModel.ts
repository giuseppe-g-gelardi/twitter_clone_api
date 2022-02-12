import mongoose, { Schema } from 'mongoose'

export const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post', default: [] }]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User
