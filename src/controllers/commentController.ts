import { Request, Response } from 'express'
import Comment, { Comments } from '../models/commentModel'
import Post from '../models/postModel'
import User from '../models/userModel'

export const postNewComment = async (req: Request, res: Response) => {
  // try {
  //   const post = await Post.findOne({_id: req.params.postid})
  //   if (!post) return res.status(404).json(`Post: ${req.params.postid} not found`)

  //   const user = await User.findOne({ })
  //   if (!user) return res.status(404).json(`User: ${user} not found`)

  //   const comment = new Comment({
  //     body: req.body.body,
  //     user: user._id,
  //     username: user.username
  //   })
  //   await comment.save()

  //   user.posts.push(post._id)
  //   await user.save()

  //   return res.json(comment)
  // } catch (error) {
  //   return res.status(500).json(`Internal server error: ${error}`)
  // }
  return res.json('comment route')
}
