import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'

export const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post', default: [] }]
}, { timestamps: true })

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, username: this.username, email: this.email}, process.env.JWT!)
}

const User = mongoose.model("User", userSchema)
export default User
