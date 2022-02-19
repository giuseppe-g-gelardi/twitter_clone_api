import { Request, Response } from 'express'
import Comment, { Comments } from '../models/commentModel'
import Post from '../models/postModel'
import User from '../models/userModel'

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find()
    if (!comments) return res.status(404).json('No comments to show?')
    
    return res.json(comments)
  } catch (error: any) {
    return res.status(500).json(`Internal server error: ${error?.message}`)
  }
}

export const postNewComment = async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({_id: req.params.postid})
    if (!post) return res.status(404).json(`Post: ${req.params.postid} not found`)

    const user = await User.findOne({ username: req.params.username})
    if (!user) return res.status(404).json(`User: ${user} not found`)

    const comment = new Comment({
      body: req.body.body,
      user: user._id,
      username: user.username
    })
    await comment.save()

    post.comments.push(comment._id)
    await user.save()

    return res.json(comment)
  } catch (error: any) {
    return res.status(500).json(`Internal server error: ${error.message}`)
  }
}
