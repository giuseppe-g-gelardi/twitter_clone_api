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

export const likeUnlikeComment = async (req: Request, res: Response) => {
  return res.json('like/unlike comment')
  // try {
    

  //   let post = await Post.findById(req.params.postid)
  //   if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)



  // } catch (error) {
    
  // }
}
// http://localhost:8000/api/comments/seppe/620f39593bd2f802685b1595/comments/:commentid/likes

// export const likeUnlike = async (req: Request, res: Response) => {
//   try {
//     let post = await Post.findById(req.params.postid)
//     if (!post) return res.status(404).json(`Post with id: ${req.params.postid} does not exist`)

//     let message;
//     if (post.likes.includes(req.body.userid)) {
//       post.likes.pull(req.body.userid)
//       message = 'disliked'
//     } else {
//       post.likes.push(req.body.userid)
//       message = 'liked'
//     }
//     await post.save()
//     return res.status(200).json({ post, message })
//   } catch (error) {
//     res.status(500).send(`Internal server error --Unable to like/unlike post. ${error}`)
    
//   }
// }

// export const getPostLikes = async (req: Request, res: Response) => {
//   try {
//     const post = await Post.findOne({ _id: req.params.postid })
//     if (!post) return res.status(404).json(`Post with id: ${req.params.postid} not found`)

//     let likes = post.likes
//     if (!likes) return res.json(`Post ${post} has no likes`)

//     return res.status(200).json(likes)
//   } catch (error) {
//     return res.status(500).json(`unable to find likes... ${error}`)
//   }
// }
